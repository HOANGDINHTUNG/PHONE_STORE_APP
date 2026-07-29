package com.re.ecommerce.modules.catalog.controller;

import org.springframework.transaction.annotation.Transactional;
import com.re.ecommerce.modules.catalog.entity.*;
import com.re.ecommerce.modules.catalog.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class CatalogControllerIntegrationTest {

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BrandRepository brandRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private ProductVariantRepository variantRepository;

    @BeforeEach
    void setUp() throws Exception {
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY FALSE");
        jdbcTemplate.execute("TRUNCATE TABLE product_price_histories RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE related_products RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE product_variants RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE products RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE brands RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE categories RESTART IDENTITY");
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY TRUE");
    }

    @Test
    void shouldReturnTrendingProducts() throws Exception {
        Category cat = new Category(null, "Trending Cat", "trending-cat", "desc", CategoryStatus.ACTIVE, 0);
        categoryRepository.save(cat);
        Brand brand = new Brand("Trending Brand", "trending-brand", "logo", "desc");
        brandRepository.save(brand);

        Product p = new Product(cat, brand, "Trending Phone", "trending-phone", "desc");
        p.setPublicationStatus(PublicationStatus.ACTIVE);
        productRepository.save(p);

        ProductVariant v = new ProductVariant(p, "SKU1", "Name", "Red", 8, 256, null, 12, new BigDecimal("100"), null);
        v.setStatus(VariantStatus.ACTIVE);
        variantRepository.save(v);
        
        p.getVariants().add(v);

        mockMvc.perform(get("/api/v1/catalog/trending-products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Trending Phone"));
    }

    @Test
    void shouldReturnSearchSuggestions() throws Exception {
        Category cat = new Category(null, "Galaxy", "galaxy-cat", "desc", CategoryStatus.ACTIVE, 0);
        categoryRepository.save(cat);

        mockMvc.perform(get("/api/v1/catalog/search-suggestions?q=galaxy"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].type").value("CATEGORY"))
                .andExpect(jsonPath("$[0].title").value("Galaxy"));
    }
}
