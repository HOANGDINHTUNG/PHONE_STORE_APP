package com.re.ecommerce.modules.catalog.controller;

import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.catalog.dto.request.BrandRequest;
import com.re.ecommerce.modules.catalog.entity.Brand;
import com.re.ecommerce.modules.catalog.entity.BrandStatus;
import com.re.ecommerce.modules.catalog.entity.Category;
import com.re.ecommerce.modules.catalog.entity.Product;
import com.re.ecommerce.modules.catalog.repository.BrandRepository;
import com.re.ecommerce.modules.catalog.repository.CategoryRepository;
import com.re.ecommerce.modules.catalog.repository.ProductRepository;
import com.re.ecommerce.modules.catalog.entity.PublicationStatus;
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
public class BrandControllerIntegrationTest {

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BrandRepository brandRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private String adminToken;

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
        jdbcTemplate.execute("TRUNCATE TABLE product_attributes RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE product_specifications RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE product_images RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE product_price_histories RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE product_variants RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE products RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE brands RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE categories RESTART IDENTITY");
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY TRUE");

        adminToken = jwtUtils.generateToken("adminuser", "ADMIN");
    }

    @Test
    void shouldListPublicBrandsReturnOnlyActive() throws Exception {
        Brand active = new Brand("Apple", "apple", "logo", "Apple Desc");
        brandRepository.save(active);

        Brand inactive = new Brand("Samsung", "samsung", "logo", "Samsung Desc");
        inactive.setStatus(BrandStatus.INACTIVE);
        brandRepository.save(inactive);

        mockMvc.perform(get("/api/v1/brands"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Apple"));
    }

    @Test
    void shouldAllowCreateBrandForAdmin() throws Exception {
        BrandRequest request = new BrandRequest("Apple", "url", "desc");

        mockMvc.perform(post("/api/v1/admin/brands")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Apple"))
                .andExpect(jsonPath("$.slug").value("apple"));
    }

    @Test
    void shouldReturn409OnDuplicateBrandSlug() throws Exception {
        Brand brand = new Brand("Apple", "apple", "logo", "Apple Desc");
        brandRepository.save(brand);

        BrandRequest request = new BrandRequest("Apple", "url", "desc");

        mockMvc.perform(post("/api/v1/admin/brands")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.errorCode").value("BRAND_SLUG_EXISTS"));
    }

    @Test
    void shouldReturn409InactiveBrandWithActiveProducts() throws Exception {
        Brand brand = new Brand("Apple", "apple", "logo", "Apple Desc");
        brandRepository.save(brand);
        
        Category cat = new Category(null, "Cat", "cat", "desc", com.re.ecommerce.modules.catalog.entity.CategoryStatus.ACTIVE, 0);
        categoryRepository.save(cat);
        
        Product p = new Product(cat, brand, "iPhone", "iphone", "desc");
        p.setPublicationStatus(PublicationStatus.ACTIVE);
        productRepository.save(p);

        mockMvc.perform(patch("/api/v1/admin/brands/" + brand.getId() + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .param("status", "INACTIVE"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.errorCode").value("BRAND_IN_USE"));
    }
}
