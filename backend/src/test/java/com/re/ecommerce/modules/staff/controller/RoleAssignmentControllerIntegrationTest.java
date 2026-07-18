package com.re.ecommerce.modules.staff.controller;

import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.auth.repository.CustomerProfileRepository;
import com.re.ecommerce.modules.staff.dto.request.UserRoleRequest;
import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import com.re.ecommerce.modules.staff.entity.Role;
import com.re.ecommerce.modules.staff.entity.UserRole;
import com.re.ecommerce.modules.staff.repository.RoleRepository;
import com.re.ecommerce.modules.staff.repository.UserRoleRepository;
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
import java.time.Instant;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class RoleAssignmentControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Autowired
    private CustomerProfileRepository customerProfileRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private String adminToken;
    private String userToken;

    private User targetUser;
    private Role targetRole;
    private UserRole existingAssignment;

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

        targetUser = new User("targetuser", "target@test.com", "hash", "USER");
        targetUser = userRepository.save(targetUser);

        targetRole = new Role();
        targetRole.setCode("SUPPORT_L1");
        targetRole.setName("L1 Support");
        targetRole.setRoleType("CUSTOM");
        targetRole.setStatus(OrganizationStatus.ACTIVE);
        targetRole = roleRepository.save(targetRole);
        
        existingAssignment = new UserRole();
        existingAssignment.setUser(targetUser);
        existingAssignment.setRole(targetRole);
        existingAssignment.setStatus("ACTIVE");
        existingAssignment = userRoleRepository.save(existingAssignment);
    }

    @Test
    void listAssignments_shouldDenyForRegularUser() throws Exception {
        mockMvc.perform(get("/api/v1/admin/users/" + targetUser.getId() + "/role-assignments")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void listAssignments_shouldReturnAssignmentsForAdmin() throws Exception {
        mockMvc.perform(get("/api/v1/admin/users/" + targetUser.getId() + "/role-assignments")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].role.code").value("SUPPORT_L1"));
    }

    @Test
    void assignRole_shouldReturn409IfExistsAndActive() throws Exception {
        UserRoleRequest request = new UserRoleRequest();
        request.setRoleId(targetRole.getId());
        request.setExpiresAt(Instant.now().plusSeconds(86400));

        mockMvc.perform(post("/api/v1/admin/users/" + targetUser.getId() + "/role-assignments")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.errorCode").value("ASSIGNMENT_EXISTS"));
    }

    @Test
    void revokeAssignment_shouldReturn200OnSuccess() throws Exception {
        mockMvc.perform(post("/api/v1/admin/users/" + targetUser.getId() + "/role-assignments/" + existingAssignment.getId() + "/revoke")
                        .header("Authorization", "Bearer " + adminToken)
                        .param("reason", "Resigned"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REVOKED"))
                .andExpect(jsonPath("$.revokedReason").value("Resigned"));
    }
}




