package com.re.ecommerce.modules.cart.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.cart.dto.request.CartItemRequest;
import com.re.ecommerce.modules.cart.dto.request.CartItemUpdateQuantityRequest;
import com.re.ecommerce.modules.cart.repository.CartRepository;
import com.re.ecommerce.modules.cart.repository.CartItemRepository;
import com.re.ecommerce.modules.catalog.entity.Product;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.catalog.entity.Brand;
import com.re.ecommerce.modules.catalog.entity.Category;
import com.re.ecommerce.modules.catalog.entity.TrackingType;
import com.re.ecommerce.modules.catalog.repository.BrandRepository;
import com.re.ecommerce.modules.catalog.repository.CategoryRepository;
import com.re.ecommerce.modules.catalog.repository.ProductRepository;
import com.re.ecommerce.modules.catalog.repository.ProductVariantRepository;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.entity.CustomerProfile;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.auth.repository.CustomerProfileRepository;
import com.re.ecommerce.modules.auth.service.AuthService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class CartControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

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
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthService authService;

    private ProductVariant testVariant;
    private String jwtToken;

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
        
    }

    @AfterEach
    void tearDown() {
        cleanDb();
    }
    
    private void cleanDb() {
        cartItemRepository.deleteAll();
        cartRepository.deleteAll();
        customerProfileRepository.deleteAll();
        userRepository.deleteAll();
        productVariantRepository.deleteAll();
        productRepository.deleteAll();
        brandRepository.deleteAll();
        categoryRepository.deleteAll();
    }

    @Test
    void getGuestCart_shouldReturnEmptyCart() throws Exception {
        mockMvc.perform(get("/api/v1/cart")
                .header("X-Guest-Token", "random-guest-token"))
                .andDo(org.springframework.test.web.servlet.result.MockMvcResultHandlers.print())
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
                .andExpect(jsonPath("$.items[0].quantity").value(2))
                .andExpect(jsonPath("$.grandTotal").value(
                    org.hamcrest.Matchers.anyOf(
                        org.hamcrest.Matchers.is(180),
                        org.hamcrest.Matchers.is(180.0),
                        org.hamcrest.Matchers.equalTo(180.00),
                        org.hamcrest.Matchers.equalTo(180.0)
                    )
                ));
    }
}
