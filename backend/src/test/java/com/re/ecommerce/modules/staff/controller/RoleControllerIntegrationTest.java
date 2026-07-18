package com.re.ecommerce.modules.staff.controller;

import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.staff.dto.request.RoleRequest;
import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import com.re.ecommerce.modules.staff.entity.Permission;
import com.re.ecommerce.modules.staff.entity.Role;
import com.re.ecommerce.modules.staff.repository.PermissionRepository;
import com.re.ecommerce.modules.staff.repository.RoleRepository;
import com.re.ecommerce.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import java.util.Set;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class RoleControllerIntegrationTest {

    @org.springframework.beans.factory.annotation.Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;


    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private String adminToken;
    private String userToken;
    
    private Role setupRole;
    private Permission setupPermission;

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

adminToken = jwtUtils.generateToken("adminuser", "ADMIN");
        userToken = jwtUtils.generateToken("regularuser", "USER");

        setupPermission = new Permission();
        setupPermission.setCode("USER_VIEW");
        setupPermission.setModule("USER");
        setupPermission.setStatus(OrganizationStatus.ACTIVE);
        setupPermission = permissionRepository.save(setupPermission);

        setupRole = new Role();
        setupRole.setCode("EDITOR_ROLE");
        setupRole.setName("Content Editor");
        setupRole.setRoleType("CUSTOM");
        setupRole.setStatus(OrganizationStatus.ACTIVE);
        setupRole = roleRepository.save(setupRole);
    }

    @Test
    void listPermissions_shouldDenyForRegularUser() throws Exception {
        mockMvc.perform(get("/api/v1/admin/permissions")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void listPermissions_shouldSucceedForAdmin() throws Exception {
        mockMvc.perform(get("/api/v1/admin/permissions")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].code").value("USER_VIEW"));
    }

    @Test
    void createRole_shouldReturn400OnInvalidPayload() throws Exception {
        RoleRequest request = new RoleRequest();
        request.setCode(""); // Blank is invalid

        mockMvc.perform(post("/api/v1/admin/roles")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value("VALIDATION_FAILED"));
    }

    @Test
    void createRole_shouldReturn201OnSuccess() throws Exception {
        RoleRequest request = new RoleRequest();
        request.setCode("HR_MANAGER");
        request.setName("HR Role");

        mockMvc.perform(post("/api/v1/admin/roles")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("HR_MANAGER"));
    }

    @Test
    void assignPermissions_shouldReturn200OnSuccess() throws Exception {
        mockMvc.perform(put("/api/v1/admin/roles/" + setupRole.getId() + "/permissions")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Set.of(setupPermission.getId()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.permissions", hasSize(1)));
    }
}




