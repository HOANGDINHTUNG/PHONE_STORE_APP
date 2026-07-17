package com.re.ecommerce.modules.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.auth.dto.request.LoginRequest;
import com.re.ecommerce.modules.auth.dto.request.RegisterRequest;
import com.re.ecommerce.modules.auth.dto.request.TokenRefreshRequest;
import com.re.ecommerce.modules.auth.dto.response.AuthResponse;
import com.re.ecommerce.modules.auth.repository.RefreshTokenRepository;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AdvancedAuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    
    @Autowired
    private com.re.ecommerce.modules.auth.repository.EmailVerificationTokenRepository emailVerificationTokenRepository;
    
    @Autowired
    private com.re.ecommerce.modules.auth.repository.PasswordResetTokenRepository passwordResetTokenRepository;

    @BeforeEach
    void setUp() {
        refreshTokenRepository.deleteAll();
        emailVerificationTokenRepository.deleteAll();
        passwordResetTokenRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void shouldLockAccountAfterMaxFailedLogins() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("lockoutuser", "lockout@example.com", "password123");
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        LoginRequest wrongLogin = new LoginRequest("lockoutuser", "wrongpassword");

        // 5 failed attempts
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(post("/api/v1/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(wrongLogin)))
                    .andExpect(status().isBadRequest()); // Inside logic it's IllegalArgumentException handled as 400 initially. Wait, actually I updated GlobalExceptionHandler?
        }

        // 6th attempt should return 423 LOCKED or similar (AccountLockedException mapped to 423)
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(wrongLogin)))
                .andExpect(status().isLocked());
    }

    @Test
    void shouldRotateTokenAndPreventReuse() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("rotateuser", "rotate@example.com", "password123");
        MvcResult registerResult = mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        AuthResponse authResponse = objectMapper.readValue(registerResult.getResponse().getContentAsString(), AuthResponse.class);
        String initialRefreshToken = authResponse.refreshToken();

        // 1. Refresh successfully
        TokenRefreshRequest refreshRequest = new TokenRefreshRequest(initialRefreshToken);
        MvcResult refreshResult = mockMvc.perform(post("/api/v1/auth/token/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isOk())
                .andReturn();

        AuthResponse newAuthResponse = objectMapper.readValue(refreshResult.getResponse().getContentAsString(), AuthResponse.class);
        String nextRefreshToken = newAuthResponse.refreshToken();

        // 2. Trying to use the old (initial) refresh token should trigger Token Reuse Detected (401)
        mockMvc.perform(post("/api/v1/auth/token/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isUnauthorized());

        // 3. Trying to use the next refresh token should ALSO fail because token reuse revoked the ENTIRE family
        TokenRefreshRequest nextRefreshRequest = new TokenRefreshRequest(nextRefreshToken);
        mockMvc.perform(post("/api/v1/auth/token/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(nextRefreshRequest)))
                .andExpect(status().isUnauthorized());
    }
}
