package com.re.ecommerce.modules.auth.service.impl;

import com.re.ecommerce.common.exception.*;
import com.re.ecommerce.modules.auth.dto.request.*;
import com.re.ecommerce.modules.auth.dto.response.AuthResponse;
import com.re.ecommerce.modules.auth.entity.AccountStatus;
import com.re.ecommerce.modules.auth.entity.TokenFamily;
import com.re.ecommerce.modules.auth.entity.User;
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

    @Mock
    private UserRepository userRepository;

    @Mock
    private CustomerProfileRepository customerProfileRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private EmailVerificationTokenRepository emailVerificationTokenRepository;

    @Mock
    private TokenFamilyRepository tokenFamilyRepository;

    @Mock
    private UserPasswordHistoryRepository userPasswordHistoryRepository;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private AuthServiceImpl authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User("testuser", "test@example.com", "encodedPassword", "USER");
        testUser.setId(UUID.randomUUID());
        testUser.setActive(true);
        testUser.setAccountStatus(AccountStatus.ACTIVE);
    }

    @Test
    void login_Success() {
        LoginRequest req = new LoginRequest("test@example.com", "password");
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);
        when(jwtUtils.generateToken(anyString(), anyString())).thenReturn("access-token");
        when(tokenFamilyRepository.save(any())).thenAnswer(inv -> {
            TokenFamily f = inv.getArgument(0);
            f.setId(UUID.randomUUID());
            return f;
        });
        
        AuthResponse response = authService.login(req, "127.0.0.1", "test-agent");
        
        assertNotNull(response);
        assertEquals("access-token", response.accessToken());
        assertEquals(0, testUser.getFailedLoginCount());
        verify(userRepository, times(1)).save(testUser);
        verify(refreshTokenRepository, times(1)).save(any());
    }

    @Test
    void login_InvalidCredentials_UserNotFound() {
        LoginRequest req = new LoginRequest("notFound@example.com", "password");
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> authService.login(req, null, null));
    }

    @Test
    void login_InvalidPassword_IncrementsFailedCount() {
        LoginRequest req = new LoginRequest("test@example.com", "wrongPass");
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPass", "encodedPassword")).thenReturn(false);

        testUser.setFailedLoginCount(4);

        assertThrows(IllegalArgumentException.class, () -> authService.login(req, null, null));

        assertEquals(5, testUser.getFailedLoginCount());
        assertEquals(AccountStatus.LOCKED, testUser.getAccountStatus());
        assertNotNull(testUser.getLockedUntil());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void login_AccountLocked_ThrowsException() {
        testUser.setAccountStatus(AccountStatus.LOCKED);
        testUser.setLockedUntil(LocalDateTime.now().plusMinutes(10));
        LoginRequest req = new LoginRequest("test@example.com", "password");
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));

        assertThrows(AccountLockedException.class, () -> authService.login(req, null, null));
    }

    @Test
    void login_AccountLocked_ButLockExpired() {
        testUser.setAccountStatus(AccountStatus.LOCKED);
        testUser.setLockedUntil(LocalDateTime.now().minusMinutes(5)); // expired lock
        testUser.setFailedLoginCount(5);
        testUser.setEmailVerifiedAt(LocalDateTime.now());

        LoginRequest req = new LoginRequest("test@example.com", "password");
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);
        when(jwtUtils.generateToken(anyString(), anyString())).thenReturn("access-token");
        when(tokenFamilyRepository.save(any())).thenAnswer(inv -> {
            TokenFamily f = inv.getArgument(0);
            f.setId(UUID.randomUUID());
            return f;
        });

        AuthResponse res = authService.login(req, null, null);

        assertNotNull(res);
        assertEquals(AccountStatus.ACTIVE, testUser.getAccountStatus());
        assertNull(testUser.getLockedUntil());
        assertEquals(0, testUser.getFailedLoginCount());
    }

    @Test
    void login_AccountDisabled_ThrowsException() {
        testUser.setAccountStatus(AccountStatus.DISABLED);
        LoginRequest req = new LoginRequest("test@example.com", "password");
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        
        assertThrows(UnauthorizedException.class, () -> authService.login(req, null, null));
    }
    @Test
    void register_Success() {
        RegisterRequest req = new RegisterRequest("New User", "new@example.com", "password", "0909090909", true);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByPhone(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(jwtUtils.generateToken(anyString(), anyString())).thenReturn("access-token");
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(UUID.randomUUID());
            return u;
        });
        when(tokenFamilyRepository.save(any())).thenAnswer(inv -> {
            TokenFamily f = inv.getArgument(0);
            f.setId(UUID.randomUUID());
            return f;
        });
        
        AuthResponse res = authService.register(req);
        
        assertNotNull(res);
        assertEquals("access-token", res.accessToken());
        verify(userRepository, times(1)).save(any(User.class));
        verify(customerProfileRepository, times(1)).save(any());
        verify(emailVerificationTokenRepository, times(1)).save(any());
        verify(refreshTokenRepository, times(1)).save(any());
    }

    @Test
    void register_EmailExists() {
        RegisterRequest req = new RegisterRequest("New User", "existing@example.com", "password", null, true);
        when(userRepository.existsByEmail(anyString())).thenReturn(true);
        
        assertThrows(IllegalArgumentException.class, () -> authService.register(req));
    }
    
    @Test
    void register_PhoneExists() {
        RegisterRequest req = new RegisterRequest("New User", "new@example.com", "password", "0909090909", true);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByPhone(anyString())).thenReturn(true);
        
        assertThrows(IllegalArgumentException.class, () -> authService.register(req));
    }

    @Test
    void refreshToken_Success() {
        TokenRefreshRequest req = new TokenRefreshRequest("old-raw-token");
        com.re.ecommerce.modules.auth.entity.RefreshToken rToken = new com.re.ecommerce.modules.auth.entity.RefreshToken(testUser, "hash", UUID.randomUUID(), LocalDateTime.now().plusDays(1), "1.2.3.4", "agent");
        
        when(refreshTokenRepository.findByTokenHash(anyString())).thenReturn(Optional.of(rToken));
        when(jwtUtils.generateToken(anyString(), anyString())).thenReturn("new-access-token");
        
        AuthResponse res = authService.refreshToken(req, "127.0.0.1", "agent");
        
        assertNotNull(res);
        assertTrue(rToken.isRevoked()); // the old token must be revoked
        assertEquals("ROTATED", rToken.getRevokedReason());
        verify(refreshTokenRepository, times(2)).save(any());
    }

    @Test
    void refreshToken_Revoked_ThrowsReuseDetected() {
        TokenRefreshRequest req = new TokenRefreshRequest("old-raw-token");
        com.re.ecommerce.modules.auth.entity.RefreshToken rToken = new com.re.ecommerce.modules.auth.entity.RefreshToken(testUser, "hash", UUID.randomUUID(), LocalDateTime.now().plusDays(1), "1.2.3.4", "agent");
        rToken.setRevokedAt(LocalDateTime.now()); // Revoked
        
        when(refreshTokenRepository.findByTokenHash(anyString())).thenReturn(Optional.of(rToken));
        
        assertThrows(UnauthorizedException.class, () -> authService.refreshToken(req, "127.0.0.1", "agent"));
        verify(refreshTokenRepository, times(1)).revokeFamily(any(), anyString());
    }

    @Test
    void refreshToken_Expired() {
        TokenRefreshRequest req = new TokenRefreshRequest("old-raw-token");
        com.re.ecommerce.modules.auth.entity.RefreshToken rToken = new com.re.ecommerce.modules.auth.entity.RefreshToken(testUser, "hash", UUID.randomUUID(), LocalDateTime.now().minusDays(1), "1.2.3.4", "agent");
        
        when(refreshTokenRepository.findByTokenHash(anyString())).thenReturn(Optional.of(rToken));
        
        assertThrows(UnauthorizedException.class, () -> authService.refreshToken(req, "127.0.0.1", "agent"));
    }

    @Test
    void logout_Success() {
        LogoutRequest req = new LogoutRequest("raw-refresh");
        com.re.ecommerce.modules.auth.entity.RefreshToken rToken = new com.re.ecommerce.modules.auth.entity.RefreshToken(testUser, "hash", UUID.randomUUID(), LocalDateTime.now().plusDays(1), "1.2.3.4", "agent");
        
        when(refreshTokenRepository.findByTokenHash(anyString())).thenReturn(Optional.of(rToken));
        
        authService.logout(req);
        
        assertTrue(rToken.isRevoked());
        assertEquals("USER_LOGOUT", rToken.getRevokedReason());
    }

    @Test
    void confirmEmail_Success() {
        EmailVerificationConfirmRequest req = new EmailVerificationConfirmRequest("raw-token");
        com.re.ecommerce.modules.auth.entity.EmailVerificationToken eToken = new com.re.ecommerce.modules.auth.entity.EmailVerificationToken(testUser, "hash", LocalDateTime.now().plusDays(1));
        testUser.setAccountStatus(AccountStatus.PENDING_VERIFICATION);
        
        when(emailVerificationTokenRepository.findByTokenHash(anyString())).thenReturn(Optional.of(eToken));
        
        authService.confirmEmail(req);
        
        assertTrue(eToken.isUsed());
        assertEquals(AccountStatus.ACTIVE, testUser.getAccountStatus());
        assertNotNull(testUser.getEmailVerifiedAt());
        verify(userRepository, times(1)).save(testUser);
    }
    
    @Test
    void resendVerificationEmail_Success() {
        EmailVerificationRequest req = new EmailVerificationRequest("test@example.com");
        testUser.setAccountStatus(AccountStatus.PENDING_VERIFICATION);
        
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        
        authService.resendVerificationEmail(req);
        
        verify(emailVerificationTokenRepository, times(1)).invalidateAllUserTokens(testUser);
        verify(emailVerificationTokenRepository, times(1)).save(any());
    }

    @Test
    void requestPasswordReset_Success() {
        PasswordResetRequest req = new PasswordResetRequest("test@example.com");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordResetTokenRepository.countRecentRequests(any(), any())).thenReturn(1L);
        
        authService.requestPasswordReset(req, "1.2.3.4");
        
        verify(passwordResetTokenRepository, times(1)).invalidateAllUserTokens(testUser);
        verify(passwordResetTokenRepository, times(1)).save(any());
    }

    @Test
    void requestPasswordReset_RateLimitExceeded() {
        PasswordResetRequest req = new PasswordResetRequest("test@example.com");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordResetTokenRepository.countRecentRequests(any(), any())).thenReturn(5L);
        
        assertThrows(RateLimitExceededException.class, () -> authService.requestPasswordReset(req, "1.2.3.4"));
    }

    @Test
    void confirmPasswordReset_Success() {
        PasswordResetConfirmRequest req = new PasswordResetConfirmRequest("raw-token", "newPass");
        com.re.ecommerce.modules.auth.entity.PasswordResetToken pToken = new com.re.ecommerce.modules.auth.entity.PasswordResetToken(testUser, "hash", LocalDateTime.now().plusDays(1), "1.2.3.4");
        
        when(passwordResetTokenRepository.findByTokenHash(anyString())).thenReturn(Optional.of(pToken));
        when(passwordEncoder.encode(anyString())).thenReturn("newEncoded");
        
        authService.confirmPasswordReset(req);
        
        assertTrue(pToken.isUsed());
        assertEquals("newEncoded", testUser.getPasswordHash());
        verify(refreshTokenRepository, times(1)).revokeAllUserTokens(testUser.getId(), "PASSWORD_RESET");
    }
}
