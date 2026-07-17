package com.re.ecommerce.modules.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.auth.dto.request.LoginRequest;
import com.re.ecommerce.modules.auth.dto.request.RegisterRequest;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.hasKey;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class OpenApiConformanceTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.re.ecommerce.modules.auth.repository.RefreshTokenRepository refreshTokenRepository;
    
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

    @Nested
    class RegisterConformance {

        @Test
        void shouldReturn400ValidationFailedOnEmptyRequestFields() throws Exception {
            RegisterRequest request = new RegisterRequest("", "invalid-email", "short");

            mockMvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errorCode").value("VALIDATION_FAILED"))
                    .andExpect(jsonPath("$.message").value("Dữ liệu đầu vào không hợp lệ."))
                    .andExpect(jsonPath("$.correlationId").exists())
                    .andExpect(jsonPath("$.fieldErrors").value(
                            allOf(
                                    hasKey("username"),
                                    hasKey("email"),
                                    hasKey("password")
                            )
                    ));
        }

        @Test
        void shouldReturn400BadRequestOnTakenUsername() throws Exception {
            // Register first user
            RegisterRequest request1 = new RegisterRequest("testuser", "test1@example.com", "password123");
            mockMvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request1)))
                    .andExpect(status().isCreated());

            // Attempt to register second user with same username
            RegisterRequest request2 = new RegisterRequest("testuser", "test2@example.com", "password123");
            mockMvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request2)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errorCode").value("BAD_REQUEST"))
                    .andExpect(jsonPath("$.message").value("Username is already taken"))
                    .andExpect(jsonPath("$.correlationId").exists());
        }

        @Test
        void shouldReturn400BadRequestOnRegisteredEmail() throws Exception {
            // Register first user
            RegisterRequest request1 = new RegisterRequest("testuser1", "test@example.com", "password123");
            mockMvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request1)))
                    .andExpect(status().isCreated());

            // Attempt to register second user with same email
            RegisterRequest request2 = new RegisterRequest("testuser2", "test@example.com", "password123");
            mockMvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request2)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errorCode").value("BAD_REQUEST"))
                    .andExpect(jsonPath("$.message").value("Email is already registered"))
                    .andExpect(jsonPath("$.correlationId").exists());
        }
    }

    @Nested
    class LoginConformance {

        @Test
        void shouldReturn400ValidationFailedOnEmptyRequestFields() throws Exception {
            LoginRequest request = new LoginRequest("", "");

            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errorCode").value("VALIDATION_FAILED"))
                    .andExpect(jsonPath("$.message").value("Dữ liệu đầu vào không hợp lệ."))
                    .andExpect(jsonPath("$.correlationId").exists())
                    .andExpect(jsonPath("$.fieldErrors").value(
                            allOf(
                                    hasKey("username"),
                                    hasKey("password")
                            )
                    ));
        }

        @Test
        void shouldReturn400BadRequestOnInvalidCredentials() throws Exception {
            LoginRequest request = new LoginRequest("wronguser", "wrongpass");

            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errorCode").value("BAD_REQUEST"))
                    .andExpect(jsonPath("$.message").value("Invalid username or password"))
                    .andExpect(jsonPath("$.correlationId").exists());
        }
    }
}
