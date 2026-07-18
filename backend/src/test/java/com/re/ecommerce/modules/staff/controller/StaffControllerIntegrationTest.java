package com.re.ecommerce.modules.staff.controller;

import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.auth.repository.CustomerProfileRepository;
import com.re.ecommerce.modules.staff.dto.request.StaffProfileRequest;
import com.re.ecommerce.modules.staff.entity.Department;
import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import com.re.ecommerce.modules.staff.entity.Position;
import com.re.ecommerce.modules.staff.repository.DepartmentRepository;
import com.re.ecommerce.modules.staff.repository.PositionRepository;
import com.re.ecommerce.modules.staff.repository.StaffProfileRepository;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class StaffControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private StaffProfileRepository staffProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Autowired
    private CustomerProfileRepository customerProfileRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private String adminToken;
    private String userToken;
    private Department activeDepartment;
    private Position activePosition;

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

        activeDepartment = new Department();
        activeDepartment.setCode("IT_DEPT");
        activeDepartment.setName("Information Technology");
        activeDepartment.setStatus(OrganizationStatus.ACTIVE);
        activeDepartment = departmentRepository.save(activeDepartment);

        activePosition = new Position();
        activePosition.setDepartment(activeDepartment);
        activePosition.setCode("SOFTWARE_ENG");
        activePosition.setName("Software Engineer");
        activePosition.setStatus(OrganizationStatus.ACTIVE);
        activePosition = positionRepository.save(activePosition);
    }

    @Test
    void listStaff_shouldDenyForAnonymousAndRegularUser() throws Exception {
        mockMvc.perform(get("/api/v1/admin/staff"))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/v1/admin/staff")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void createStaff_shouldReturn201OnSuccess() throws Exception {
        StaffProfileRequest request = new StaffProfileRequest();
        request.setFullName("John Doe");
        request.setEmail("john.doe@test.com");
        request.setPhone("0901234567");
        request.setEmployeeCode("STF-1001");
        request.setPositionId(activePosition.getId());

        mockMvc.perform(post("/api/v1/admin/staff")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.employeeCode").value("STF-1001"))
                .andExpect(jsonPath("$.email").value("john.doe@test.com"))
                .andExpect(jsonPath("$.position.code").value("SOFTWARE_ENG"));
    }

    @Test
    void createStaff_shouldReturn400OnMissingEmailAndCode() throws Exception {
        StaffProfileRequest request = new StaffProfileRequest();
        request.setFullName("John Doe");
        request.setPhone("0901234567"); // Email & Code missing intentionally
        request.setPositionId(activePosition.getId());

        mockMvc.perform(post("/api/v1/admin/staff")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value("VALIDATION_FAILED"));
    }

    @Test
    void getStaff_shouldReturn404OnNotFound() throws Exception {
        mockMvc.perform(get("/api/v1/admin/staff/" + java.util.UUID.randomUUID())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.errorCode").value("STAFF_NOT_FOUND"));
    }

    @Test
    void updateStaff_shouldReturn400OnValidationFailure() throws Exception {
        com.re.ecommerce.modules.staff.dto.request.StaffProfileUpdateAdminRequest request = new com.re.ecommerce.modules.staff.dto.request.StaffProfileUpdateAdminRequest();
        request.setFullName(""); // Invalid name
        request.setEmployeeCode("ST"); // Too short
        request.setPositionId(activePosition.getId());

        mockMvc.perform(patch("/api/v1/admin/staff/" + java.util.UUID.randomUUID())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value("VALIDATION_FAILED"));
    }

    @Test
    void changeStatus_shouldReturn400OnInvalidStatus() throws Exception {
        mockMvc.perform(patch("/api/v1/admin/staff/" + java.util.UUID.randomUUID() + "/employment-status")
                        .header("Authorization", "Bearer " + adminToken)
                        .param("status", "PENSION")) // Invalid enum value
                .andExpect(status().isBadRequest());
    }
}




