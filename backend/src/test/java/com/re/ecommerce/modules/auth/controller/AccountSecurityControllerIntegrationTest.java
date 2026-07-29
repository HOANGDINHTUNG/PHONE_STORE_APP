package com.re.ecommerce.modules.auth.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.auth.dto.request.LoginRequest;
import com.re.ecommerce.modules.auth.dto.request.PasswordChangeRequest;
import com.re.ecommerce.modules.auth.dto.request.RegisterRequest;
import com.re.ecommerce.modules.auth.entity.TokenFamily;
import com.re.ecommerce.modules.auth.repository.TokenFamilyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AccountSecurityControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

//     @Autowired
//     private UserRepository userRepository;

    @Autowired
    private TokenFamilyRepository tokenFamilyRepository;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() throws Exception {
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY FALSE");
        jdbcTemplate.execute("TRUNCATE TABLE password_reset_tokens RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE refresh_tokens RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE token_families RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE user_password_histories RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE users RESTART IDENTITY");
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY TRUE");
    }

    private String getAccessToken() throws Exception {
        RegisterRequest registerReq = new RegisterRequest("Sec User", "sec@example.com", "password123", null, true);
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated());

        LoginRequest loginReq = new LoginRequest("sec", "password123");
        MvcResult res = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode responseNode = objectMapper.readTree(res.getResponse().getContentAsString());
        return responseNode.get("accessToken").asText();
    }

    @Test
    void shouldChangePasswordSuccessfully() throws Exception {
        String token = getAccessToken();
        PasswordChangeRequest request = new PasswordChangeRequest("password123", "newPassword456");

        mockMvc.perform(post("/api/v1/me/password-changes")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNoContent());

        LoginRequest loginReq = new LoginRequest("sec", "newPassword456");
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk());
    }

    @Test
    void shouldFailToChangePasswordWithWrongCurrentPassword() throws Exception {
        String token = getAccessToken();
        PasswordChangeRequest request = new PasswordChangeRequest("wrongpass", "newPassword456");

        mockMvc.perform(post("/api/v1/me/password-changes")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldListSessionsSuccessfully() throws Exception {
        String token = getAccessToken();
        
        // Log in again to create a second session
        LoginRequest loginReq = new LoginRequest("sec", "password123");
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/me/sessions")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    void shouldRevokeSessionSuccessfully() throws Exception {
        String token = getAccessToken();
        List<TokenFamily> sessions = tokenFamilyRepository.findAll();
        assertFalse(sessions.isEmpty());
        String sessionIdToRevoke = sessions.get(0).getId().toString();

        mockMvc.perform(delete("/api/v1/me/sessions/" + sessionIdToRevoke)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldRevokeOtherSessionsSuccessfully() throws Exception {
        String token = getAccessToken();

        mockMvc.perform(post("/api/v1/me/sessions/revoke-others")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
    }
}
