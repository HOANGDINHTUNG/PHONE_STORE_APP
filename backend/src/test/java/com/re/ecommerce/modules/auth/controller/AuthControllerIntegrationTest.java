package com.re.ecommerce.modules.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.auth.dto.request.LoginRequest;
import com.re.ecommerce.modules.auth.dto.request.RegisterRequest;
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

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    @Autowired
    private com.re.ecommerce.modules.auth.repository.EmailVerificationTokenRepository emailVerificationTokenRepository;
    @Autowired
    private com.re.ecommerce.modules.auth.repository.PasswordResetTokenRepository passwordResetTokenRepository;
    @Autowired
    private com.re.ecommerce.modules.auth.repository.CustomerProfileRepository customerProfileRepository;

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
    void shouldRegisterUserSuccessfully() throws Exception {
        RegisterRequest request = new RegisterRequest("Test User", "testuser@example.com", "password123", null, true);

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.role").value("USER"));

        assertTrue(userRepository.existsByUsername("testuser"));
    }

    @Test
    void shouldLoginSuccessfully() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("Login User", "login@example.com", "password123", null, true);
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        LoginRequest loginRequest = new LoginRequest("login", "password123");
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.username").value("login"));
    }

    @Test
    void shouldRefreshLogoutAndResetPasswordEndpoints() throws Exception {
        // Register and login to get token for secured endpoints
        RegisterRequest registerRequest = new RegisterRequest("Logout User", "logout@example.com", "password123", "0908888777", true);
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)));

        LoginRequest loginRequest = new LoginRequest("logout", "password123");
        org.springframework.test.web.servlet.MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andReturn();
        String content = result.getResponse().getContentAsString();
        String userToken = objectMapper.readTree(content).get("accessToken").asText();

        com.re.ecommerce.modules.auth.dto.request.TokenRefreshRequest refreshReq = new com.re.ecommerce.modules.auth.dto.request.TokenRefreshRequest("dummy-token");
        mockMvc.perform(post("/api/v1/auth/token/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refreshReq)))
                .andExpect(status().isUnauthorized()); // Invalid token hash throws 401
                
        com.re.ecommerce.modules.auth.dto.request.LogoutRequest logoutReq = new com.re.ecommerce.modules.auth.dto.request.LogoutRequest("dummy-token");
        mockMvc.perform(post("/api/v1/auth/logout")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(logoutReq)))
                .andExpect(status().isNoContent());
                
        com.re.ecommerce.modules.auth.dto.request.EmailVerificationConfirmRequest confirmEmail = new com.re.ecommerce.modules.auth.dto.request.EmailVerificationConfirmRequest("dummy-token");
        mockMvc.perform(post("/api/v1/auth/email-verifications/confirm")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(confirmEmail)))
                .andExpect(status().isBadRequest());
                
        com.re.ecommerce.modules.auth.dto.request.EmailVerificationRequest verifyReq = new com.re.ecommerce.modules.auth.dto.request.EmailVerificationRequest("test@email.com");
        mockMvc.perform(post("/api/v1/auth/email-verifications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(verifyReq)))
                .andExpect(status().isAccepted());
                
        com.re.ecommerce.modules.auth.dto.request.PasswordResetRequest resetReq = new com.re.ecommerce.modules.auth.dto.request.PasswordResetRequest("test@email.com");
        mockMvc.perform(post("/api/v1/auth/password-reset-requests")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(resetReq)))
                .andExpect(status().isAccepted());
                
        com.re.ecommerce.modules.auth.dto.request.PasswordResetConfirmRequest confirmReset = new com.re.ecommerce.modules.auth.dto.request.PasswordResetConfirmRequest("dummy-token", "newPass123");
        mockMvc.perform(post("/api/v1/auth/password-resets/confirm")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(confirmReset)))
                .andExpect(status().isBadRequest());
    }
}




