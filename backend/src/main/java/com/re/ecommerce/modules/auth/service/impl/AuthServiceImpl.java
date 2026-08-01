package com.re.ecommerce.modules.auth.service.impl;

import com.re.ecommerce.common.exception.AccountLockedException;
import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.RateLimitExceededException;
import com.re.ecommerce.common.exception.UnauthorizedException;
import com.re.ecommerce.modules.auth.dto.request.*;
import com.re.ecommerce.modules.auth.dto.response.AuthResponse;
import com.re.ecommerce.modules.auth.entity.*;
import com.re.ecommerce.modules.auth.repository.*;
import com.re.ecommerce.modules.auth.service.AuthService;
import com.re.ecommerce.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final com.re.ecommerce.modules.auth.repository.CustomerProfileRepository customerProfileRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final TokenFamilyRepository tokenFamilyRepository;
    private final UserPasswordHistoryRepository userPasswordHistoryRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCKINFO_MINUTES = 30;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String generatedUsername = generateUniqueUsername(request.email());

        boolean emailExists = userRepository.existsByEmail(request.email());
        boolean phoneExists = request.phone() != null && !request.phone().isBlank() && userRepository.existsByPhone(request.phone());
        
        if (emailExists && phoneExists) {
            throw new IllegalArgumentException("Email and Phone are already registered");
        } else if (emailExists) {
            throw new IllegalArgumentException("Email is already registered");
        } else if (phoneExists) {
            throw new IllegalArgumentException("Phone is already registered");
        }

        User user = new User(
                generatedUsername,
                request.email(),
                passwordEncoder.encode(request.password()),
                "USER"
        );
        user.setPhone(request.phone());
        userRepository.save(user);

        userPasswordHistoryRepository.save(new UserPasswordHistory(user, user.getPasswordHash()));

        // Explicitly create CustomerProfile for CUSTOMER (USER role in initial design)
        if ("USER".equals(user.getRole())) {
            CustomerProfile customerProfile = new CustomerProfile(user, generateCustomerCode(user.getId()));
            customerProfile.setFullName(request.fullName());
            customerProfile.setMarketingOptIn(Boolean.TRUE.equals(request.marketingOptIn()));
            customerProfileRepository.save(customerProfile);
        }

        // Generate email verification token conceptually (email sending would be async)
        createEmailVerificationToken(user);

        String accessToken = jwtUtils.generateToken(user.getUsername(), user.getRole());
        String rawRefreshToken = UUID.randomUUID().toString();
        
        TokenFamily family = new TokenFamily(user, "Unknown Device", null, null);
        family = tokenFamilyRepository.save(family);
        
        createRefreshToken(user, rawRefreshToken, family.getId(), null, null);

        return new AuthResponse(accessToken, rawRefreshToken, user.getUsername(), user.getRole());
    }

    @Override
    @Transactional(noRollbackFor = {IllegalArgumentException.class, AccountLockedException.class, UnauthorizedException.class})
    public AuthResponse login(LoginRequest request, String ipAddress, String userAgent) {
        User user = userRepository.findByLoginIdentifier(request.username())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        checkAccountStatus(user);

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            handleFailedLogin(user);
            throw new IllegalArgumentException("Invalid username or password");
        }

        // Login success, reset lock counts
        user.setFailedLoginCount(0);
        user.setLockedUntil(null);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtils.generateToken(user.getUsername(), user.getRole());
        String rawRefreshToken = UUID.randomUUID().toString();
        
        TokenFamily family = new TokenFamily(user, "Unknown Device", ipAddress, userAgent);
        family = tokenFamilyRepository.save(family);
        
        createRefreshToken(user, rawRefreshToken, family.getId(), ipAddress, userAgent);

        return new AuthResponse(token, rawRefreshToken, user.getUsername(), user.getRole());
    }

    @Override
    @Transactional(noRollbackFor = UnauthorizedException.class)
    public AuthResponse refreshToken(TokenRefreshRequest request, String ipAddress, String userAgent) {
        String hash = hashString(request.refreshToken());
        RefreshToken existingToken = refreshTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> new UnauthorizedException("REFRESH_TOKEN_INVALID", "Token không hợp lệ."));

        User user = existingToken.getUser();
        checkAccountStatus(user);

        if (existingToken.isRevoked()) {
            // Token reused
            refreshTokenRepository.revokeFamily(existingToken.getTokenFamilyId(), "TOKEN_REUSE_DETECTED");
            throw new UnauthorizedException("TOKEN_REUSE_DETECTED", "Phát hiện sử dụng lại token, buộc đăng nhập lại.");
        }

        if (existingToken.isExpired()) {
            throw new UnauthorizedException("REFRESH_TOKEN_EXPIRED", "Token đã hết hạn.");
        }

        // Rotate token
        existingToken.setRevokedAt(LocalDateTime.now());
        existingToken.setRevokedReason("ROTATED");
        
        String accessToken = jwtUtils.generateToken(user.getUsername(), user.getRole());
        String newRawRefreshToken = UUID.randomUUID().toString();
        
        RefreshToken newRefreshToken = createRefreshToken(user, newRawRefreshToken, existingToken.getTokenFamilyId(), ipAddress, userAgent);
        existingToken.setReplacedByToken(newRefreshToken);
        refreshTokenRepository.save(existingToken);

        return new AuthResponse(accessToken, newRawRefreshToken, user.getUsername(), user.getRole());
    }

    @Override
    @Transactional
    public void logout(LogoutRequest request) {
        String hash = hashString(request.refreshToken());
        refreshTokenRepository.findByTokenHash(hash).ifPresent(token -> {
            if (!token.isRevoked()) {
                token.setRevokedAt(LocalDateTime.now());
                token.setRevokedReason("USER_LOGOUT");
                refreshTokenRepository.save(token);
            }
        });
    }

    @Override
    @Transactional
    public void confirmEmail(EmailVerificationConfirmRequest request) {
        String hash = hashString(request.token());
        EmailVerificationToken token = emailVerificationTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification token"));

        if (token.isUsed() || token.isExpired()) {
            throw new BusinessConflictException("TOKEN_INVALID_OR_EXPIRED", "Token xác minh không hợp lệ hoặc đã hết hạn.");
        }

        token.setUsedAt(LocalDateTime.now());
        emailVerificationTokenRepository.save(token);

        User user = token.getUser();
        if (user.getAccountStatus() == AccountStatus.PENDING_VERIFICATION) {
            user.setAccountStatus(AccountStatus.ACTIVE);
            user.setEmailVerifiedAt(LocalDateTime.now());
            userRepository.save(user);
        }
    }

    @Override
    @Transactional
    public void resendVerificationEmail(EmailVerificationRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            if (user.getAccountStatus() == AccountStatus.PENDING_VERIFICATION) {
                emailVerificationTokenRepository.invalidateAllUserTokens(user);
                createEmailVerificationToken(user);
            }
        });
    }

    @Override
    @Transactional
    public void requestPasswordReset(PasswordResetRequest request, String ipAddress) {
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            if (user.getAccountStatus() == AccountStatus.DISABLED) {
                return; // Do nothing if disabled
            }
            long recentRequests = passwordResetTokenRepository.countRecentRequests(user, LocalDateTime.now().minusHours(24));
            if (recentRequests >= 3) {
                throw new RateLimitExceededException("RATE_LIMIT_EXCEEDED", "Bạn đã yêu cầu đặt lại mật khẩu quá nhiều lần trong ngày hôm nay.");
            }
            
            passwordResetTokenRepository.invalidateAllUserTokens(user);

            String rawToken = UUID.randomUUID().toString();
            PasswordResetToken token = new PasswordResetToken(
                    user, 
                    hashString(rawToken), 
                    LocalDateTime.now().plusMinutes(15), 
                    ipAddress
            );
            passwordResetTokenRepository.save(token);
            // Async send email with rawToken
        });
    }

    @Override
    @Transactional
    public void confirmPasswordReset(PasswordResetConfirmRequest request) {
        String hash = hashString(request.token());
        PasswordResetToken token = passwordResetTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> new IllegalArgumentException("Invalid reset token"));

        if (token.isUsed() || token.isExpired()) {
            throw new BusinessConflictException("TOKEN_INVALID_OR_EXPIRED", "Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
        }

        User user = token.getUser();
        checkAccountStatus(user);

        token.setUsedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(token);

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setPasswordChangedAt(LocalDateTime.now());
        userRepository.save(user);

        userPasswordHistoryRepository.save(new UserPasswordHistory(user, user.getPasswordHash()));

        // Revoke all sessions to force relogin
        refreshTokenRepository.revokeAllUserTokens(user.getId(), "PASSWORD_RESET");
    }

    private void checkAccountStatus(User user) {
        if (user.getAccountStatus() == AccountStatus.DISABLED) {
            throw new UnauthorizedException("ACCOUNT_DISABLED", "Tài khoản đã bị vô hiệu hoá.");
        }
        if (user.getAccountStatus() == AccountStatus.LOCKED) {
            if (user.getLockedUntil() != null && LocalDateTime.now().isBefore(user.getLockedUntil())) {
                throw new AccountLockedException("ACCOUNT_LOCKED", "Tài khoản đang bị khóa do sai mật khẩu quá nhiều lần.");
            } else {
                // Unlock
                user.setAccountStatus(user.getEmailVerifiedAt() != null ? AccountStatus.ACTIVE : AccountStatus.PENDING_VERIFICATION);
                user.setLockedUntil(null);
                user.setFailedLoginCount(0);
                userRepository.save(user);
            }
        }
    }

    private void handleFailedLogin(User user) {
        if (user.getAccountStatus() == AccountStatus.DISABLED) return;
        
        user.setFailedLoginCount(user.getFailedLoginCount() + 1);
        if (user.getFailedLoginCount() >= MAX_FAILED_ATTEMPTS) {
            user.setAccountStatus(AccountStatus.LOCKED);
            user.setLockedUntil(LocalDateTime.now().plusMinutes(LOCKINFO_MINUTES));
        }
        userRepository.save(user);
    }

    private RefreshToken createRefreshToken(User user, String rawToken, UUID familyId, String ipAddress, String userAgent) {
        RefreshToken token = new RefreshToken(
                user,
                hashString(rawToken),
                familyId,
                LocalDateTime.now().plusDays(7),
                ipAddress,
                userAgent
        );
        return refreshTokenRepository.save(token);
    }

    private void createEmailVerificationToken(User user) {
        String rawToken = UUID.randomUUID().toString();
        EmailVerificationToken token = new EmailVerificationToken(
                user,
                hashString(rawToken),
                LocalDateTime.now().plusDays(1)
        );
        emailVerificationTokenRepository.save(token);
        // Async send email with rawToken
    }

    private String hashString(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }

    private String generateCustomerCode(UUID userId) {
        String uuidStr = userId.toString().replaceAll("-", "").toUpperCase();
        return "CUS" + uuidStr.substring(0, 10);
    }

    private String generateUniqueUsername(String email) {
        String base = email.split("@")[0].replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        if (base.length() < 3) base = base + "user";
        
        String username = base;
        int maxAttempts = 10;
        int attempt = 0;
        
        while (userRepository.existsByUsername(username) && attempt < maxAttempts) {
            String randomStr = UUID.randomUUID().toString().substring(0, 4);
            username = base + randomStr;
            attempt++;
        }
        
        return username;
    }
}
