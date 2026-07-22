package com.re.ecommerce.modules.staff.controller;

import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.staff.dto.request.PositionRequest;
import com.re.ecommerce.modules.staff.entity.Department;
import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import com.re.ecommerce.modules.staff.entity.Position;
import com.re.ecommerce.modules.staff.repository.DepartmentRepository;
import com.re.ecommerce.modules.staff.repository.PositionRepository;
import com.re.ecommerce.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class PositionControllerIntegrationTest {

    @org.springframework.beans.factory.annotation.Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;


    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PositionRepository positionRepository;

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
    void listPositions_shouldDenyForAnonymousUser() throws Exception {
        mockMvc.perform(get("/api/v1/admin/positions"))
                .andExpect(status().isForbidden());
    }

    @Test
    void listPositions_shouldDenyForRegularUser() throws Exception {
        // Requires STAFF or ADMIN
        mockMvc.perform(get("/api/v1/admin/positions")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void listPositions_shouldReturnPageForAdmin() throws Exception {
        mockMvc.perform(get("/api/v1/admin/positions")
                        .header("Authorization", "Bearer " + adminToken)
                        .param("departmentId", activeDepartment.getId().toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].code").value("SOFTWARE_ENG"));
    }

    @Test
    void createPosition_shouldReturn201OnSuccess() throws Exception {
        PositionRequest request = new PositionRequest();
        request.setDepartmentId(activeDepartment.getId());
        request.setCode("QA_ENG");
        request.setName("Quality Assurance Engineer");

        mockMvc.perform(post("/api/v1/admin/positions")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("QA_ENG"));
    }

    @Test
    void createPosition_shouldReturn400OnInvalidRegex() throws Exception {
        PositionRequest request = new PositionRequest();
        request.setDepartmentId(activeDepartment.getId());
        request.setCode("INVALID CODE"); // Invalid because of space, needs to be regex ^[A-Z0-9_]+$
        request.setName("Invalid Pattern Code");

        mockMvc.perform(post("/api/v1/admin/positions")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value("VALIDATION_FAILED"));
    }

    @Test
    void updatePosition_shouldReturn200OnSuccess() throws Exception {
        PositionRequest request = new PositionRequest();
        request.setDepartmentId(activeDepartment.getId());
        request.setCode("SOFTWARE_ENG_SR");
        request.setName("Senior Software Engineer");

        mockMvc.perform(patch("/api/v1/admin/positions/" + activePosition.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("SOFTWARE_ENG_SR"))
                .andExpect(jsonPath("$.name").value("Senior Software Engineer"));
    }

    @Test
    void changePositionStatus_shouldReturn200OnSuccess() throws Exception {
        mockMvc.perform(patch("/api/v1/admin/positions/" + activePosition.getId() + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .param("status", "INACTIVE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("INACTIVE"));
    }
}




