package com.re.ecommerce.modules.catalog.controller;

import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.catalog.dto.request.ProductCreateRequest;
import com.re.ecommerce.modules.catalog.entity.Brand;
import com.re.ecommerce.modules.catalog.entity.Category;
import com.re.ecommerce.modules.catalog.entity.Product;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.catalog.repository.BrandRepository;
import com.re.ecommerce.modules.catalog.repository.CategoryRepository;
import com.re.ecommerce.modules.catalog.repository.ProductRepository;
import com.re.ecommerce.modules.catalog.repository.ProductVariantRepository;
import com.re.ecommerce.modules.catalog.entity.PublicationStatus;
import com.re.ecommerce.modules.catalog.entity.CategoryStatus;
import com.re.ecommerce.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

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
public class ProductControllerIntegrationTest {

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
    private ProductVariantRepository variantRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private String adminToken;
    private Category activeCategory;
    private Brand activeBrand;

    @BeforeEach
    void setUp() throws Exception {
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY FALSE");
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
        
        activeCategory = new Category(null, "Phones", "phones", "desc", CategoryStatus.ACTIVE, 0);
        categoryRepository.save(activeCategory);
        
        activeBrand = new Brand("Apple", "apple", "logo", "desc");
        brandRepository.save(activeBrand);
    }

    @Test
    void shouldReturn200OnPublicProductSearch() throws Exception {
        Product p = new Product(activeCategory, activeBrand, "iPhone 15", "iphone-15", "desc");
        p.setPublicationStatus(PublicationStatus.ACTIVE);
        productRepository.save(p);
        
        ProductVariant v = new ProductVariant(p, "SKU1", "Base", null, null, null, null, null, BigDecimal.valueOf(100), null);
        variantRepository.save(v);

        mockMvc.perform(get("/api/v1/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("iPhone 15"));
    }

    @Test
    void shouldReturn404OnProductNotFound() throws Exception {
        Product p = new Product(activeCategory, activeBrand, "iPhone 15", "iphone-15", "desc");
        productRepository.save(p); // Status is DRAFT

        mockMvc.perform(get("/api/v1/products/iphone-15"))
                .andExpect(status().isNotFound()); // Draft should not be found publicly
    }

    @Test
    void shouldCreateProductAsDraft() throws Exception {
        ProductCreateRequest req = new ProductCreateRequest(activeCategory.getId(), activeBrand.getId(), "iPhone 16", "desc");

        mockMvc.perform(post("/api/v1/admin/products")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("iPhone 16"))
                .andExpect(jsonPath("$.publicationStatus").value("DRAFT"));
    }

    @Test
    void shouldReturn409OnPublishWithNoActiveVariant() throws Exception {
        Product p = new Product(activeCategory, activeBrand, "iPhone 15", "iphone-15", "desc");
        productRepository.save(p);

        mockMvc.perform(patch("/api/v1/admin/products/" + p.getId() + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .param("status", "ACTIVE"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.errorCode").value("NO_ACTIVE_VARIANT"));
    }
}
