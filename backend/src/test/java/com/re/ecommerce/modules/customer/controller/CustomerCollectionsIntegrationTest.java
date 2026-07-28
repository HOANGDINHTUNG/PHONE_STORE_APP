package com.re.ecommerce.modules.customer.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.auth.dto.request.LoginRequest;
import com.re.ecommerce.modules.auth.dto.request.RegisterRequest;
import com.re.ecommerce.modules.auth.entity.CustomerProfile;
import com.re.ecommerce.modules.auth.repository.CustomerProfileRepository;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.catalog.entity.Brand;
import com.re.ecommerce.modules.catalog.entity.Category;
import com.re.ecommerce.modules.catalog.entity.Product;
import com.re.ecommerce.modules.catalog.entity.PublicationStatus;
import com.re.ecommerce.modules.catalog.repository.BrandRepository;
import com.re.ecommerce.modules.catalog.repository.CategoryRepository;
import com.re.ecommerce.modules.catalog.repository.ProductRepository;
import com.re.ecommerce.modules.customer.dto.request.CompareAddRequest;
import com.re.ecommerce.modules.customer.dto.request.WishlistAddRequest;
import com.re.ecommerce.modules.customer.repository.CompareItemRepository;
import com.re.ecommerce.modules.customer.repository.WishlistItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class CustomerCollectionsIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CustomerProfileRepository customerProfileRepository;
    @Autowired
    private CompareItemRepository compareItemRepository;
    @Autowired
    private WishlistItemRepository wishlistItemRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    private List<Product> testProducts = new ArrayList<>();

    @BeforeEach
    void setUp() throws Exception {
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY FALSE");
        jdbcTemplate.execute("TRUNCATE TABLE wishlist_items RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE compare_items RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE products RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE brands RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE categories RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE customer_profiles RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE users RESTART IDENTITY");
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY TRUE");
        
        setupTestData();
    }

    private void setupTestData() {
        Brand brand = brandRepository.save(new Brand("Apple", "apple", "", ""));
        Category category = categoryRepository.save(new Category(null, "Phones", "phones", "", com.re.ecommerce.modules.catalog.entity.CategoryStatus.ACTIVE, 0));
        
        for (int i = 0; i < 6; i++) {
            Product p = new Product(category, brand, "iPhone " + i, "iphone-" + i, "desc");
            p.setPublicationStatus(PublicationStatus.ACTIVE);
            testProducts.add(productRepository.save(p));
        }
    }

    private String getAccessToken() throws Exception {
        RegisterRequest registerReq = new RegisterRequest("Test User", "test@example.com", "password123", "0901234567", true);
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated());

        LoginRequest loginReq = new LoginRequest("test", "password123");
        MvcResult res = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode responseNode = objectMapper.readTree(res.getResponse().getContentAsString());
        return responseNode.get("accessToken").asText();
    }

    @Test
    void shouldManageWishlistSuccessfully() throws Exception {
        String token = getAccessToken();
        UUID productId = testProducts.get(0).getId();

        // 1. Add to wishlist
        WishlistAddRequest req = new WishlistAddRequest(productId);
        mockMvc.perform(post("/api/v1/me/wishlist-items")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());

        // 2. Add same product -> idempotent (201 or 200 depending on framework, but service won't error)
        mockMvc.perform(post("/api/v1/me/wishlist-items")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());

        // 3. List wishlist
        mockMvc.perform(get("/api/v1/me/wishlist-items")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items.length()").value(1))
                .andExpect(jsonPath("$.items[0].product.name").value("iPhone 0"));

        // 4. Remove from wishlist
        mockMvc.perform(delete("/api/v1/me/wishlist-items/" + productId)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        // 5. Verify empty
        mockMvc.perform(get("/api/v1/me/wishlist-items")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items.length()").value(0));
    }

    @Test
    void shouldFailToAddInactiveProductToWishlist() throws Exception {
        String token = getAccessToken();
        Product inactiveProduct = testProducts.get(5);
        inactiveProduct.setPublicationStatus(PublicationStatus.INACTIVE);
        productRepository.save(inactiveProduct);

        WishlistAddRequest req = new WishlistAddRequest(inactiveProduct.getId());
        mockMvc.perform(post("/api/v1/me/wishlist-items")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldManageCompareListAndEnforceMax4Limit() throws Exception {
        String token = getAccessToken();

        // Add 4 items
        for (int i = 0; i < 4; i++) {
            CompareAddRequest req = new CompareAddRequest(testProducts.get(i).getId());
            mockMvc.perform(post("/api/v1/me/compare-items")
                    .header("Authorization", "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isCreated());
        }

        // Add 5th item -> should fail due to maximum of 4 limit
        CompareAddRequest exceededReq = new CompareAddRequest(testProducts.get(4).getId());
        mockMvc.perform(post("/api/v1/me/compare-items")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(exceededReq)))
                .andExpect(status().isConflict()); // 409 Conflict

        mockMvc.perform(get("/api/v1/me/compare-items")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4));
    }

    @Test
    void shouldPreventCompareLimitViolationUnderConcurrency() throws Exception {
        String token = getAccessToken();
        CustomerProfile profile = customerProfileRepository.findAll().get(0);

        ExecutorService executor = Executors.newFixedThreadPool(5);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(5);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger rejectCount = new AtomicInteger(0);

        for (int i = 0; i < 5; i++) {
            final int index = i;
            executor.submit(() -> {
                try {
                    latch.await();
                    CompareAddRequest req = new CompareAddRequest(testProducts.get(index).getId());
                    MvcResult result = mockMvc.perform(post("/api/v1/me/compare-items")
                            .header("Authorization", "Bearer " + token)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                            .andReturn();
                            
                    if (result.getResponse().getStatus() == 201 || result.getResponse().getStatus() == 200) {
                        successCount.incrementAndGet();
                    } else {
                        rejectCount.incrementAndGet();
                    }
                } catch (Exception e) {
                    rejectCount.incrementAndGet();
                } finally {
                    doneLatch.countDown();
                }
            });
        }
        
        latch.countDown();
        doneLatch.await();
        executor.shutdown();

        // Expect exactly 4 to succeed and 1 to be rejected under concurrent conditions
        assertEquals(4, successCount.get(), "Exactly 4 adds should succeed");
        assertEquals(1, rejectCount.get(), "Exactly 1 add should fail due to limit constraint");

        assertEquals(4, compareItemRepository.countByCustomer_Id(profile.getId()), "Db size should be exactly 4");
    }
}
