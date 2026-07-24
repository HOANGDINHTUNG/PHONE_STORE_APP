package com.re.ecommerce.modules.cart.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.transaction.annotation.Transactional;
import com.re.ecommerce.modules.cart.dto.request.CartItemRequest;
import com.re.ecommerce.modules.cart.dto.request.CartItemUpdateQuantityRequest;
import com.re.ecommerce.modules.catalog.entity.Product;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.catalog.entity.Brand;
import com.re.ecommerce.modules.catalog.entity.Category;
import com.re.ecommerce.modules.catalog.entity.TrackingType;
import com.re.ecommerce.modules.catalog.repository.BrandRepository;
import com.re.ecommerce.modules.catalog.repository.CategoryRepository;
import com.re.ecommerce.modules.catalog.repository.ProductRepository;
import com.re.ecommerce.modules.catalog.repository.ProductVariantRepository;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.auth.repository.CustomerProfileRepository;
import com.re.ecommerce.modules.auth.entity.User;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class CartControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;



    @Autowired
    private ProductVariantRepository productVariantRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private BrandRepository brandRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CustomerProfileRepository customerProfileRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.re.ecommerce.security.JwtUtils jwtUtils;

    private ProductVariant testVariant;
    private User testUser;
    private String userToken;

    @BeforeEach
    void setUp() throws Exception {
        cleanDb();
        
        // Setup Brand and Category
        Brand brand = new Brand("TestBrand", "test-brand", "logo", "desc");
        brand = brandRepository.save(brand);
        
        Category category = new Category(null, "TestCategory", "test-cat", "desc", com.re.ecommerce.modules.catalog.entity.CategoryStatus.ACTIVE, 0);
        category = categoryRepository.save(category);

        // Setup Product and Variant
        Product product = new Product(category, brand, "Test Product", "sku-test", "slug-test");
        product.setPublicationStatus(com.re.ecommerce.modules.catalog.entity.PublicationStatus.ACTIVE);
        product = productRepository.save(product);

        testVariant = new ProductVariant(product, "SKU-TEST-1", "Variant 1", "Black", 8, 256, TrackingType.NONE, 12, new BigDecimal("100.00"), new BigDecimal("90.00"));
        testVariant = productVariantRepository.save(testVariant);

        testUser = new User("cartuser", "cart@example.com", "password", "USER");
        testUser = userRepository.save(testUser);

        com.re.ecommerce.modules.auth.entity.CustomerProfile profile = new com.re.ecommerce.modules.auth.entity.CustomerProfile(testUser, "CUST-CART");
        profile.setFullName("Cart User");
        customerProfileRepository.save(profile);

        userToken = jwtUtils.generateToken(testUser.getUsername(), testUser.getRole());
    }

    @AfterEach
    void tearDown() {
        cleanDb();
    }
    
    private void cleanDb() {
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY FALSE");
        jdbcTemplate.execute("TRUNCATE TABLE password_reset_tokens RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE email_verification_tokens RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE refresh_tokens RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE customer_profiles RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE staff_profiles RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE shipping_addresses RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE users RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE cart_items RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE carts RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE product_variants RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE products RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE brands RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE categories RESTART IDENTITY");
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY TRUE");
    }

    @Test
    void getGuestCart_shouldReturnEmptyCart() throws Exception {
        mockMvc.perform(get("/api/v1/cart")
                .header("X-Guest-Token", "random-guest-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.grandTotal").value(0))
                .andExpect(jsonPath("$.items").isEmpty());
    }

    @Test
    void addGuestCartItem_shouldSuccess() throws Exception {
        CartItemRequest request = new CartItemRequest();
        request.setProductVariantId(testVariant.getId());
        request.setQuantity(2);

        mockMvc.perform(post("/api/v1/cart/items")
                .header("X-Guest-Token", "random-guest-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].productVariantId").value(testVariant.getId().toString()))
                .andExpect(jsonPath("$.items[0].quantity").value(2));
    }

    @Test
    void addLoggedUserCartItem_shouldSuccess() throws Exception {
        CartItemRequest request = new CartItemRequest();
        request.setProductVariantId(testVariant.getId());
        request.setQuantity(1);

        mockMvc.perform(post("/api/v1/cart/items")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].productVariantId").value(testVariant.getId().toString()))
                .andExpect(jsonPath("$.items[0].quantity").value(1));
    }

    @Test
    void updateCartItemQuantity_shouldSuccess() throws Exception {
        // Add item first
        CartItemRequest addReq = new CartItemRequest();
        addReq.setProductVariantId(testVariant.getId());
        addReq.setQuantity(1);

        String response = mockMvc.perform(post("/api/v1/cart/items")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        String cartItemId = JsonPath.read(response, "$.items[0].id");

        // Update quantity
        CartItemUpdateQuantityRequest updateReq = new CartItemUpdateQuantityRequest();
        updateReq.setQuantity(5);

        mockMvc.perform(patch("/api/v1/cart/items/" + cartItemId)
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].quantity").value(5));
    }



    @Test
    void removeCartItem_shouldSuccess() throws Exception {
        // Add item first
        CartItemRequest addReq = new CartItemRequest();
        addReq.setProductVariantId(testVariant.getId());
        addReq.setQuantity(1);

        String response = mockMvc.perform(post("/api/v1/cart/items")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        String cartItemId = JsonPath.read(response, "$.items[0].id");

        // Remove item
        mockMvc.perform(delete("/api/v1/cart/items/" + cartItemId)
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isNoContent());

        // Verify it was removed
        mockMvc.perform(get("/api/v1/cart")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isEmpty());
    }

    @Test
    void clearCart_shouldSuccess() throws Exception {
        // Add item first
        CartItemRequest addReq = new CartItemRequest();
        addReq.setProductVariantId(testVariant.getId());
        addReq.setQuantity(1);

        mockMvc.perform(post("/api/v1/cart/items")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isOk());

        // Clear cart
        mockMvc.perform(delete("/api/v1/cart/items")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isNoContent());

        // Verify it was cleared
        mockMvc.perform(get("/api/v1/cart")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isEmpty());
    }

    @Test
    void mergeCart_shouldSuccess() throws Exception {
        // Add item to guest cart
        CartItemRequest addGuestReq = new CartItemRequest();
        addGuestReq.setProductVariantId(testVariant.getId());
        addGuestReq.setQuantity(2);

        mockMvc.perform(post("/api/v1/cart/items")
                .header("X-Guest-Token", "merge-guest-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(addGuestReq)))
                .andExpect(status().isOk());

        // Merge cart for authenticated user
        mockMvc.perform(post("/api/v1/cart/merge")
                .header("X-Guest-Token", "merge-guest-token")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].quantity").value(2));
    }
}
