package com.re.ecommerce.modules.catalog.controller;

import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.catalog.dto.request.VariantCreateRequest;
import com.re.ecommerce.modules.catalog.dto.request.PriceChangeRequest;
import com.re.ecommerce.modules.catalog.entity.Brand;
import com.re.ecommerce.modules.catalog.entity.Category;
import com.re.ecommerce.modules.catalog.entity.Product;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.catalog.repository.BrandRepository;
import com.re.ecommerce.modules.catalog.repository.CategoryRepository;
import com.re.ecommerce.modules.catalog.repository.ProductRepository;
import com.re.ecommerce.modules.catalog.repository.ProductVariantRepository;
import com.re.ecommerce.modules.catalog.entity.CategoryStatus;
import com.re.ecommerce.modules.catalog.entity.TrackingType;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class ProductVariantControllerIntegrationTest {

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
    private Product product;

    @BeforeEach
    void setUp() throws Exception {
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY FALSE");
        jdbcTemplate.execute("TRUNCATE TABLE product_images RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE product_price_histories RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE product_variants RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE products RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE brands RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE categories RESTART IDENTITY");
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY TRUE");

        adminToken = jwtUtils.generateToken("adminuser", "ADMIN");
        
        Category activeCategory = new Category(null, "Phones", "phones", "desc", CategoryStatus.ACTIVE, 0);
        categoryRepository.save(activeCategory);
        
        Brand activeBrand = new Brand("Apple", "apple", "logo", "desc");
        brandRepository.save(activeBrand);
        
        product = new Product(activeCategory, activeBrand, "iPhone 15", "iphone-15", "desc");
        productRepository.save(product);
    }

    @Test
    void shouldCreateVariant() throws Exception {
        VariantCreateRequest req = new VariantCreateRequest("SKU1", "Base", "Black", 8, 256, TrackingType.SERIALIZED, 12, BigDecimal.valueOf(1000), BigDecimal.valueOf(900));

        mockMvc.perform(post("/api/v1/admin/products/" + product.getId() + "/variants")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.sku").value("SKU1"))
                .andExpect(jsonPath("$.listPrice").value(1000));
    }

    @Test
    void shouldReturn409OnDuplicateSku() throws Exception {
        ProductVariant v = new ProductVariant(product, "SKU1", "Base", null, null, null, null, null, BigDecimal.valueOf(100), null);
        variantRepository.save(v);

        VariantCreateRequest req = new VariantCreateRequest("SKU1", "Other", "White", 8, 256, TrackingType.SERIALIZED, 12, BigDecimal.valueOf(1000), BigDecimal.valueOf(900));

        mockMvc.perform(post("/api/v1/admin/products/" + product.getId() + "/variants")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.errorCode").value("VARIANT_SKU_EXISTS"));
    }

    @Test
    void shouldChangePriceAndCreateHistory() throws Exception {
        ProductVariant v = new ProductVariant(product, "SKU1", "Base", null, null, null, null, null, BigDecimal.valueOf(100), null);
        variantRepository.save(v);
        
        PriceChangeRequest req = new PriceChangeRequest(BigDecimal.valueOf(200), BigDecimal.valueOf(150), "Sale");

        mockMvc.perform(post("/api/v1/admin/variants/" + v.getId() + "/price-changes")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.listPrice").value(200))
                .andExpect(jsonPath("$.salePrice").value(150));
    }
}
