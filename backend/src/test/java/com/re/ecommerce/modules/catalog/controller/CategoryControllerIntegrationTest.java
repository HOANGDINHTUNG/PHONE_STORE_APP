package com.re.ecommerce.modules.catalog.controller;

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
public class CategoryControllerIntegrationTest {

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
    void setUp() {
        categoryRepository.deleteAll();
        auditLogRepository.deleteAll();
        adminToken = jwtUtils.generateToken("adminuser", "ADMIN");
        userToken = jwtUtils.generateToken("regularuser", "USER");
    }

    @Test
    void shouldPermitPublicAccessToGetActiveCategoryTree() throws Exception {
        // Create an active root category and an inactive one
        Category activeCategory = new Category(null, "Điện thoại", "dien-thoai", "Category for phones", CategoryStatus.ACTIVE, 0);
        categoryRepository.save(activeCategory);

        Category inactiveCategory = new Category(null, "Máy tính bảng", "may-tinh-bang", "Category for tablets", CategoryStatus.INACTIVE, 1);
        categoryRepository.save(inactiveCategory);

        mockMvc.perform(get("/api/v1/categories/tree"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Điện thoại"))
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
        Category c1 = new Category(null, "Điện thoại", "dien-thoai", "phones", CategoryStatus.ACTIVE, 0);
        categoryRepository.save(c1);

        Category c2 = new Category(c1, "Apple", "apple", "apple phones", CategoryStatus.ACTIVE, 1);
        categoryRepository.save(c2);

        // Attempting to set C1's parent to C2 (Creating C1 -> C2 -> C1 cycle)
        CategoryRequest badRequest = new CategoryRequest("Điện thoại", c2.getId(), "phones description updated", CategoryStatus.ACTIVE, 0);

        mockMvc.perform(patch("/api/v1/admin/categories/" + c1.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badRequest)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.errorCode").value("CATEGORY_CYCLE_DETECTED"));
    }

    @Test
    void shouldReturn409IfDeactivatingParentWithActiveChildren() throws Exception {
        Category c1 = new Category(null, "Điện thoại", "dien-thoai", "phones", CategoryStatus.ACTIVE, 0);
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
        Category parent = new Category(null, "Điện thoại", "dien-thoai", "phones", CategoryStatus.INACTIVE, 0);
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
}
