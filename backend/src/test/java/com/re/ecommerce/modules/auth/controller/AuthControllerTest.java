package com.re.ecommerce.modules.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.auth.dto.request.*;
import com.re.ecommerce.modules.auth.dto.response.AuthResponse;
import com.re.ecommerce.modules.auth.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.re.ecommerce.security.JwtAuthenticationFilter;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // Ignore security filters for unit test
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void register() throws Exception {
        RegisterRequest req = new RegisterRequest("Test", "test@test.com", "password", "0912121212", true);
        AuthResponse res = new AuthResponse("access", "refresh", "testuser", "USER");

        when(authService.register(any(RegisterRequest.class))).thenReturn(res);

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").value("access"));
    }

    @Test
    void login() throws Exception {
        LoginRequest req = new LoginRequest("test@test.com", "password");
        AuthResponse res = new AuthResponse("access", "refresh", "testuser", "USER");

        when(authService.login(any(LoginRequest.class), any(), any())).thenReturn(res);

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("access"));
    }

    @Test
    void refreshToken() throws Exception {
        TokenRefreshRequest req = new TokenRefreshRequest("refresh");
        AuthResponse res = new AuthResponse("access2", "refresh2", "testuser", "USER");

        when(authService.refreshToken(any(TokenRefreshRequest.class), any(), any())).thenReturn(res);

        mockMvc.perform(post("/api/v1/auth/token/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("access2"));
    }

    @Test
    void logout() throws Exception {
        LogoutRequest req = new LogoutRequest("refresh");

        doNothing().when(authService).logout(any(LogoutRequest.class));

        mockMvc.perform(post("/api/v1/auth/logout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isNoContent());
    }

    @Test
    void confirmEmail() throws Exception {
        EmailVerificationConfirmRequest req = new EmailVerificationConfirmRequest("token");

        doNothing().when(authService).confirmEmail(any());

        mockMvc.perform(post("/api/v1/auth/email-verifications/confirm")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isNoContent());
    }

    @Test
    void resendVerificationEmail() throws Exception {
        EmailVerificationRequest req = new EmailVerificationRequest("test@test.com");

        doNothing().when(authService).resendVerificationEmail(any());

        mockMvc.perform(post("/api/v1/auth/email-verifications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isAccepted());
    }

    @Test
    void requestPasswordReset() throws Exception {
        PasswordResetRequest req = new PasswordResetRequest("test@test.com");

        doNothing().when(authService).requestPasswordReset(any(), any());

        mockMvc.perform(post("/api/v1/auth/password-reset-requests")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isAccepted());
    }

    @Test
    void confirmPasswordReset() throws Exception {
        PasswordResetConfirmRequest req = new PasswordResetConfirmRequest("token", "newPassword123");

        doNothing().when(authService).confirmPasswordReset(any());

        mockMvc.perform(post("/api/v1/auth/password-resets/confirm")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isNoContent());
    }

    @Test
    void checkExists_withEmailAndPhone() throws Exception {
        when(authService.checkEmailExists("test@test.com")).thenReturn(true);
        when(authService.checkPhoneExists("0911")).thenReturn(false);

        mockMvc.perform(get("/api/v1/auth/check-exists")
                .param("email", "test@test.com")
                .param("phone", "0911"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.emailExists").value(true))
                .andExpect(jsonPath("$.phoneExists").value(false));
    }
}
