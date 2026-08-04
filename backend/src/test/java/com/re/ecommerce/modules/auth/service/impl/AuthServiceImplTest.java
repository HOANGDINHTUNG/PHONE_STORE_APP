package com.re.ecommerce.modules.auth.service.impl;

import com.re.ecommerce.common.exception.AccountLockedException;
import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.RateLimitExceededException;
import com.re.ecommerce.common.exception.UnauthorizedException;
import com.re.ecommerce.modules.auth.dto.request.*;
import com.re.ecommerce.modules.auth.dto.response.AuthResponse;
import com.re.ecommerce.modules.auth.entity.*;
import com.re.ecommerce.modules.auth.repository.*;
import com.re.ecommerce.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock private UserRepository userRepository;
    @Mock private CustomerProfileRepository customerProfileRepository;
    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private TokenFamilyRepository tokenFamilyRepository;
    @Mock private UserPasswordHistoryRepository userPasswordHistoryRepository;
    @Mock private EmailVerificationTokenRepository emailVerificationTokenRepository;
    @Mock private PasswordResetTokenRepository passwordResetTokenRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtils jwtUtils;

    @InjectMocks private AuthServiceImpl authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User("testuser", "test@pinkphone.com", "encodedPass", "USER");
        testUser.setId(UUID.randomUUID());
        testUser.setPhone("0912121212");
        testUser.setAccountStatus(AccountStatus.ACTIVE);
    }

    // --- REGISTER TESTS ---
    @Test
    void register_Success() {
        RegisterRequest req = new RegisterRequest("Test Name", "new@pinkphone.com", "password", "0999999999", true);
        
        when(userRepository.existsByEmail(req.email())).thenReturn(false);
        when(userRepository.existsByPhone(req.phone())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPass");
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArgument(0);
            u.setId(UUID.randomUUID());
            return u;
        });
        when(tokenFamilyRepository.save(any())).thenAnswer(i -> {
            TokenFamily f = i.getArgument(0);
            f.setId(UUID.randomUUID());
            return f;
        });
        when(jwtUtils.generateToken(anyString(), anyString())).thenReturn("jwt-token");

        AuthResponse response = authService.register(req);

        assertNotNull(response);
        assertEquals("jwt-token", response.accessToken());
        assertNotNull(response.refreshToken());
        verify(userRepository, times(1)).save(any(User.class));
        verify(customerProfileRepository, times(1)).save(any(CustomerProfile.class));
        verify(emailVerificationTokenRepository, times(1)).save(any());
    }

    @Test
    void register_EmailAndPhoneAlreadyExists() {
        RegisterRequest req = new RegisterRequest("T", "test@pinkphone.com", "p", "0912121212", true);
        when(userRepository.existsByEmail(anyString())).thenReturn(true);
        when(userRepository.existsByPhone(anyString())).thenReturn(true);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> authService.register(req));
        assertEquals("Email and Phone are already registered", ex.getMessage());
    }

    @Test
    void register_EmailAlreadyExists() {
        RegisterRequest req = new RegisterRequest("T", "test@pinkphone.com", "p", "0912121212", true);
        when(userRepository.existsByEmail(anyString())).thenReturn(true);
        when(userRepository.existsByPhone(anyString())).thenReturn(false);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> authService.register(req));
        assertEquals("Email is already registered", ex.getMessage());
    }
    
    @Test
    void register_PhoneAlreadyExists() {
        RegisterRequest req = new RegisterRequest("T", "test@pinkphone.com", "p", "0912121212", true);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByPhone(anyString())).thenReturn(true);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> authService.register(req));
        assertEquals("Phone is already registered", ex.getMessage());
    }

    // --- LOGIN TESTS ---
    @Test
    void login_Success() {
        LoginRequest req = new LoginRequest("test@pinkphone.com", "password");
        when(userRepository.findByLoginIdentifier(req.username())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(req.password(), testUser.getPasswordHash())).thenReturn(true);
        when(tokenFamilyRepository.save(any())).thenAnswer(i -> {
            TokenFamily f = i.getArgument(0);
            f.setId(UUID.randomUUID());
            return f;
        });
        when(jwtUtils.generateToken(anyString(), anyString())).thenReturn("new-jwt");

        AuthResponse response = authService.login(req, "127.0.0.1", "Browser");

        assertNotNull(response);
        assertEquals("new-jwt", response.accessToken());
        assertEquals(0, testUser.getFailedLoginCount());
        verify(refreshTokenRepository, times(1)).save(any());
    }

    @Test
    void login_InvalidPassword_IncrementsFailedCount() {
        LoginRequest req = new LoginRequest("test@pinkphone.com", "wrong");
        when(userRepository.findByLoginIdentifier(req.username())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(req.password(), testUser.getPasswordHash())).thenReturn(false);
        
        testUser.setFailedLoginCount(4); // Testing limit
        assertThrows(IllegalArgumentException.class, () -> authService.login(req, "ip", "agent"));
        
        assertEquals(5, testUser.getFailedLoginCount());
        assertEquals(AccountStatus.LOCKED, testUser.getAccountStatus());
        assertNotNull(testUser.getLockedUntil());
    }
    
    @Test
    void login_AccountLocked() {
        LoginRequest req = new LoginRequest("user", "pass");
        testUser.setAccountStatus(AccountStatus.LOCKED);
        testUser.setLockedUntil(LocalDateTime.now().plusMinutes(5));
        when(userRepository.findByLoginIdentifier(anyString())).thenReturn(Optional.of(testUser));
        
        assertThrows(AccountLockedException.class, () -> authService.login(req, "ip", "agent"));
    }

    @Test
    void login_AccountDisabled() {
        LoginRequest req = new LoginRequest("user", "pass");
        testUser.setAccountStatus(AccountStatus.DISABLED);
        when(userRepository.findByLoginIdentifier(anyString())).thenReturn(Optional.of(testUser));
        
        assertThrows(UnauthorizedException.class, () -> authService.login(req, "ip", "agent"));
    }

    // --- REFRESH TOKEN TESTS ---
    @Test
    void refreshToken_Success() {
        TokenRefreshRequest req = new TokenRefreshRequest("valid-refresh-token");
        RefreshToken rToken = new RefreshToken(testUser, "hash", UUID.randomUUID(), LocalDateTime.now().plusDays(1), "ip", "agent");
        
        when(refreshTokenRepository.findByTokenHash(anyString())).thenReturn(Optional.of(rToken));
        when(jwtUtils.generateToken(anyString(), anyString())).thenReturn("new-jwt");
        
        AuthResponse resp = authService.refreshToken(req, "ip", "agent");
        
        assertNotNull(resp);
        assertEquals("new-jwt", resp.accessToken());
        assertTrue(rToken.isRevoked()); // the old one gets rotated
        verify(refreshTokenRepository, times(2)).save(any());
    }

    @Test
    void refreshToken_Reused_RevokesFamily() {
        TokenRefreshRequest req = new TokenRefreshRequest("reused-token");
        RefreshToken rToken = new RefreshToken(testUser, "hash", UUID.randomUUID(), LocalDateTime.now().minusDays(1), "ip", "agent");
        rToken.setRevokedAt(LocalDateTime.now()); // Already revoked!
        
        when(refreshTokenRepository.findByTokenHash(anyString())).thenReturn(Optional.of(rToken));
        
        assertThrows(UnauthorizedException.class, () -> authService.refreshToken(req, "ip", "agent"));
        verify(refreshTokenRepository, times(1)).revokeFamily(any(), anyString());
    }

    @Test
    void refreshToken_Expired() {
        TokenRefreshRequest req = new TokenRefreshRequest("expired-token");
        RefreshToken rToken = new RefreshToken(testUser, "hash", UUID.randomUUID(), LocalDateTime.now().minusDays(1), "ip", "agent");
        
        when(refreshTokenRepository.findByTokenHash(anyString())).thenReturn(Optional.of(rToken));
        
        assertThrows(UnauthorizedException.class, () -> authService.refreshToken(req, "ip", "agent"));
    }

    // --- LOGOUT ---
    @Test
    void logout_Success() {
        LogoutRequest req = new LogoutRequest("refresh-token");
        RefreshToken rToken = new RefreshToken(testUser, "hash", UUID.randomUUID(), LocalDateTime.now().plusDays(1), "ip", "agent");
        when(refreshTokenRepository.findByTokenHash(anyString())).thenReturn(Optional.of(rToken));
        
        authService.logout(req);
        
        assertTrue(rToken.isRevoked());
        assertEquals("USER_LOGOUT", rToken.getRevokedReason());
    }

    // --- PASSWORD RESET ---
    @Test
    void requestPasswordReset_Success() {
        PasswordResetRequest req = new PasswordResetRequest("test@pinkphone.com");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordResetTokenRepository.countRecentRequests(any(), any())).thenReturn(1L);
        
        authService.requestPasswordReset(req, "ip");
        
        verify(passwordResetTokenRepository, times(1)).invalidateAllUserTokens(testUser);
        verify(passwordResetTokenRepository, times(1)).save(any());
    }
    
    @Test
    void requestPasswordReset_RateLimited() {
        PasswordResetRequest req = new PasswordResetRequest("test@pinkphone.com");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordResetTokenRepository.countRecentRequests(any(), any())).thenReturn(4L);
        
        assertThrows(RateLimitExceededException.class, () -> authService.requestPasswordReset(req, "ip"));
    }

    @Test
    void confirmPasswordReset_Success() {
        PasswordResetConfirmRequest req = new PasswordResetConfirmRequest("token", "newPass");
        PasswordResetToken t = new PasswordResetToken(testUser, "hash", LocalDateTime.now().plusHours(1), "ip");
        when(passwordResetTokenRepository.findByTokenHash(anyString())).thenReturn(Optional.of(t));
        when(passwordEncoder.encode(anyString())).thenReturn("newEncoded");
        
        authService.confirmPasswordReset(req);
        
        assertTrue(t.isUsed());
        assertEquals("newEncoded", testUser.getPasswordHash());
        verify(refreshTokenRepository, times(1)).revokeAllUserTokens(testUser.getId(), "PASSWORD_RESET");
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void confirmEmail_Success() {
        EmailVerificationConfirmRequest req = new EmailVerificationConfirmRequest("token");
        testUser.setAccountStatus(AccountStatus.PENDING_VERIFICATION);
        EmailVerificationToken t = new EmailVerificationToken(testUser, "hash", LocalDateTime.now().plusDays(1));
        when(emailVerificationTokenRepository.findByTokenHash(anyString())).thenReturn(Optional.of(t));
        
        authService.confirmEmail(req);
        
        assertTrue(t.isUsed());
        assertEquals(AccountStatus.ACTIVE, testUser.getAccountStatus());
        verify(userRepository, times(1)).save(testUser);
    }
    
    @Test
    void resendVerificationEmail_Success() {
        EmailVerificationRequest req = new EmailVerificationRequest("test@pinkphone.com");
        testUser.setAccountStatus(AccountStatus.PENDING_VERIFICATION);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        
        authService.resendVerificationEmail(req);
        
        verify(emailVerificationTokenRepository, times(1)).invalidateAllUserTokens(testUser);
        verify(emailVerificationTokenRepository, times(1)).save(any());
    }

    // --- CHECK EXISTS ALREADY ---
    @Test
    void checkEmailExists_ReturnsTrue() {
        when(userRepository.existsByEmail("test@test.com")).thenReturn(true);
        assertTrue(authService.checkEmailExists("test@test.com"));
    }

    @Test
    void checkPhoneExists_ReturnsFalse() {
        when(userRepository.existsByPhone("0912345678")).thenReturn(false);
        assertFalse(authService.checkPhoneExists("0912345678"));
    }
}
