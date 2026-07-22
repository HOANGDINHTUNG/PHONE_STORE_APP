package com.re.ecommerce.modules.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.auth.dto.request.LoginRequest;
import com.re.ecommerce.modules.auth.dto.request.RegisterRequest;
import com.re.ecommerce.modules.auth.dto.request.TokenRefreshRequest;
import com.re.ecommerce.modules.auth.dto.response.AuthResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
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
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() throws Exception {
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY FALSE");
        jdbcTemplate.execute("TRUNCATE TABLE password_reset_tokens RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE email_verification_tokens RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE refresh_tokens RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE customer_profiles RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE staff_profiles RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE shipping_addresses RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE users RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE positions RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE departments RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE roles RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE permissions RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE categories RESTART IDENTITY");
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY TRUE");

}

    @Test
    void shouldLockAccountAfterMaxFailedLogins() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("Lockout User", "lockout@example.com", "password123", null, true);
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        LoginRequest wrongLogin = new LoginRequest("lockout", "wrongpassword");

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
        RegisterRequest registerRequest = new RegisterRequest("Rotate User", "rotate@example.com", "password123", null, true);
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




