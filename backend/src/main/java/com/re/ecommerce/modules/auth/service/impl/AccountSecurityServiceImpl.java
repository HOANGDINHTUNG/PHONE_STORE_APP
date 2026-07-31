package com.re.ecommerce.modules.auth.service.impl;

import com.re.ecommerce.common.exception.UnauthorizedException;
import com.re.ecommerce.modules.auth.dto.request.PasswordChangeRequest;
import com.re.ecommerce.modules.auth.dto.response.SessionResponse;
import com.re.ecommerce.modules.auth.entity.TokenFamily;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.entity.UserPasswordHistory;
import com.re.ecommerce.modules.auth.repository.RefreshTokenRepository;
import com.re.ecommerce.modules.auth.repository.TokenFamilyRepository;
import com.re.ecommerce.modules.auth.repository.UserPasswordHistoryRepository;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.auth.service.AccountSecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountSecurityServiceImpl implements AccountSecurityService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserPasswordHistoryRepository userPasswordHistoryRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final TokenFamilyRepository tokenFamilyRepository;

    @Override
    @Transactional
    public void changePassword(String currentUsername, PasswordChangeRequest request) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new UnauthorizedException("USER_NOT_FOUND", "User không tồn tại"));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("CURRENT_PASSWORD_INVALID", "Mật khẩu hiện tại không đúng");
        }
        
        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Mật khẩu mới không được trùng mật khẩu cũ");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setPasswordChangedAt(LocalDateTime.now());
        userRepository.save(user);

        userPasswordHistoryRepository.save(new UserPasswordHistory(user, user.getPasswordHash()));

        // Revoke all sessions across all families
        refreshTokenRepository.revokeAllUserTokens(user.getId(), "PASSWORD_CHANGED");
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionResponse> listMySessions(String currentUsername, UUID currentFamilyId) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new UnauthorizedException("USER_NOT_FOUND", "User không tồn tại"));

        List<TokenFamily> families = tokenFamilyRepository.findByUser(user);
        
        return families.stream().map(family -> {
            // Simplified logic: active if not all refresh tokens in family are revoked
            // In a full implementation, you'd join with RefreshToken to check expiry/revocation accurately.
            return new SessionResponse(
                    family.getId(),
                    family.getDeviceName(),
                    family.getIpAddress(),
                    family.getCreatedAt(),
                    family.getCreatedAt(), // just placeholder if we don't query last used
                    family.getId().equals(currentFamilyId),
                    true, // placeholder for active
                    family.getCreatedAt().plusDays(7)
            );
        }).toList();
    }

    @Override
    @Transactional
    public void revokeSession(String currentUsername, UUID sessionId) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new UnauthorizedException("USER_NOT_FOUND", "User không tồn tại"));
                
        TokenFamily family = tokenFamilyRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
                
        if (!family.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("SESSION_NOT_OWNED", "Session không thuộc về bạn");
        }
        
        refreshTokenRepository.revokeFamily(sessionId, "USER_REVOKED");
    }

    @Override
    @Transactional
    public void revokeOtherSessions(String currentUsername, UUID currentFamilyId) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new UnauthorizedException("USER_NOT_FOUND", "User không tồn tại"));
                
        List<TokenFamily> families = tokenFamilyRepository.findByUser(user);
        for (TokenFamily f : families) {
            if (currentFamilyId == null || !f.getId().equals(currentFamilyId)) {
                refreshTokenRepository.revokeFamily(f.getId(), "REVOKE_OTHERS");
            }
        }
    }
}
