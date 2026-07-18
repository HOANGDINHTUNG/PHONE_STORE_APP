package com.re.ecommerce.modules.catalog.controller;

import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.common.audit.repository.AuditLogRepository;
import com.re.ecommerce.modules.catalog.dto.request.CategoryRequest;
import com.re.ecommerce.modules.catalog.entity.Category;
import com.re.ecommerce.modules.catalog.entity.CategoryStatus;
import com.re.ecommerce.modules.catalog.repository.CategoryRepository;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class CategoryControllerIntegrationTest {

    @org.springframework.beans.factory.annotation.Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;


    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private String adminToken;
    private String userToken;

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
    }

    @Test
    void shouldPermitPublicAccessToGetActiveCategoryTree() throws Exception {
        // Create an active root category and an inactive one
        Category activeCategory = new Category(null, "ÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€šÃ‚ÂiÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡n thoÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â¡i", "dien-thoai", "Category for phones", CategoryStatus.ACTIVE, 0);
        categoryRepository.save(activeCategory);

        Category inactiveCategory = new Category(null, "MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡y tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­nh bÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â£ng", "may-tinh-bang", "Category for tablets", CategoryStatus.INACTIVE, 1);
        categoryRepository.save(inactiveCategory);

        mockMvc.perform(get("/api/v1/categories/tree"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("ÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€šÃ‚ÂiÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡n thoÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â¡i"))
                .andExpect(jsonPath("$[0].slug").value("dien-thoai"));
    }

    @Test
    void shouldDenyCreateCategoryWithoutToken() throws Exception {
        CategoryRequest request = new CategoryRequest("Laptop", null, "laptop category", CategoryStatus.ACTIVE, 0);

        mockMvc.perform(post("/api/v1/admin/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldDenyCreateCategoryForRegularUser() throws Exception {
        CategoryRequest request = new CategoryRequest("Laptop", null, "laptop category", CategoryStatus.ACTIVE, 0);

        mockMvc.perform(post("/api/v1/admin/categories")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldAllowCreateCategoryForAdmin() throws Exception {
        CategoryRequest request = new CategoryRequest("Laptop", null, "laptop category", CategoryStatus.ACTIVE, 0);

        mockMvc.perform(post("/api/v1/admin/categories")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Laptop"))
                .andExpect(jsonPath("$.slug").value("laptop"))
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    void shouldReturn409OnDuplicateSlug() throws Exception {
        Category category = new Category(null, "Laptop", "laptop", "laptop category", CategoryStatus.ACTIVE, 0);
        categoryRepository.save(category);

        CategoryRequest duplicateRequest = new CategoryRequest("Laptop", null, "another laptop desc", CategoryStatus.ACTIVE, 1);

        mockMvc.perform(post("/api/v1/admin/categories")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateRequest)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.errorCode").value("CATEGORY_SLUG_EXISTS"));
    }

    @Test
    void shouldReturn422OnInactiveParentAssign() throws Exception {
        Category parent = new Category(null, "Laptop", "laptop", "laptop desc", CategoryStatus.INACTIVE, 0);
        categoryRepository.save(parent);

        CategoryRequest childRequest = new CategoryRequest("Macbook", parent.getId(), "macbook desc", CategoryStatus.ACTIVE, 1);

        mockMvc.perform(post("/api/v1/admin/categories")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(childRequest)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.errorCode").value("PARENT_INACTIVE"));
    }

    @Test
    void shouldReturn422OnGraphCycleAssignedParent() throws Exception {
        Category c1 = new Category(null, "ÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€šÃ‚ÂiÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡n thoÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â¡i", "dien-thoai", "phones", CategoryStatus.ACTIVE, 0);
        categoryRepository.save(c1);

        Category c2 = new Category(c1, "Apple", "apple", "apple phones", CategoryStatus.ACTIVE, 1);
        categoryRepository.save(c2);

        // Attempting to set C1's parent to C2 (Creating C1 -> C2 -> C1 cycle)
        CategoryRequest badRequest = new CategoryRequest("ÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€šÃ‚ÂiÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡n thoÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â¡i", c2.getId(), "phones description updated", CategoryStatus.ACTIVE, 0);

        mockMvc.perform(patch("/api/v1/admin/categories/" + c1.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badRequest)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.errorCode").value("CATEGORY_CYCLE_DETECTED"));
    }

    @Test
    void shouldReturn409IfDeactivatingParentWithActiveChildren() throws Exception {
        Category c1 = new Category(null, "ÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€šÃ‚ÂiÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡n thoÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â¡i", "dien-thoai", "phones", CategoryStatus.ACTIVE, 0);
        categoryRepository.save(c1);

        Category c2 = new Category(c1, "Apple", "apple", "apple phones", CategoryStatus.ACTIVE, 1);
        categoryRepository.save(c2);

        // Attempt/change status of C1 to INACTIVE while C2 is active
        mockMvc.perform(patch("/api/v1/admin/categories/" + c1.getId() + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .param("status", "INACTIVE"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.errorCode").value("CATEGORY_IN_USE"));
    }

    @Test
    void shouldReturn409IfActivatingChildWithInactiveParent() throws Exception {
        Category parent = new Category(null, "ÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€šÃ‚ÂiÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡n thoÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â¡i", "dien-thoai", "phones", CategoryStatus.INACTIVE, 0);
        categoryRepository.save(parent);

        Category child = new Category(parent, "Apple", "apple", "apple phones", CategoryStatus.INACTIVE, 1);
        categoryRepository.save(child);

        // Attempt to activate child while parent is inactive
        mockMvc.perform(patch("/api/v1/admin/categories/" + child.getId() + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .param("status", "ACTIVE"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.errorCode").value("PARENT_INACTIVE"));
    }

    @Test
    void adminListCategories_shouldReturn200OK() throws Exception {
        Category activeCategory = new Category(null, "ÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€šÃ‚ÂiÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡n thoÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â¡i", "dien-thoai", "Category for phones", CategoryStatus.ACTIVE, 0);
        categoryRepository.save(activeCategory);

        mockMvc.perform(get("/api/v1/admin/categories")
                        .header("Authorization", "Bearer " + adminToken)
                        .param("status", "ACTIVE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("ÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€šÃ‚ÂiÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡n thoÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â¡i"));
    }

    @Test
    void getCategoryById_shouldReturn200OK() throws Exception {
        Category activeCategory = new Category(null, "ÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€šÃ‚ÂiÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡n thoÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â¡i", "dien-thoai", "Category for phones", CategoryStatus.ACTIVE, 0);
        Category saved = categoryRepository.save(activeCategory);

        mockMvc.perform(get("/api/v1/admin/categories/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("ÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€šÃ‚ÂiÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡n thoÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â¡i"));
    }

    @Test
    void getCategoryById_shouldReturn404OnNotFound() throws Exception {
        mockMvc.perform(get("/api/v1/admin/categories/" + java.util.UUID.randomUUID())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.errorCode").value("CATEGORY_NOT_FOUND"));
    }

    @Test
    void createCategory_shouldReturn400OnValidationFailure() throws Exception {
        CategoryRequest request = new CategoryRequest("", null, "laptop category", CategoryStatus.ACTIVE, 0); // Empty name

        mockMvc.perform(post("/api/v1/admin/categories")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value("VALIDATION_FAILED"));
    }
}




