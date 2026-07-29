package com.re.ecommerce.modules.customer.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.auth.dto.request.LoginRequest;
import com.re.ecommerce.modules.auth.dto.request.RegisterRequest;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.catalog.entity.Brand;
import com.re.ecommerce.modules.catalog.entity.Category;
import com.re.ecommerce.modules.catalog.entity.CategoryStatus;
import com.re.ecommerce.modules.catalog.entity.Product;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.catalog.entity.PublicationStatus;
import com.re.ecommerce.modules.catalog.repository.BrandRepository;
import com.re.ecommerce.modules.catalog.repository.CategoryRepository;
import com.re.ecommerce.modules.catalog.repository.ProductRepository;
import com.re.ecommerce.modules.catalog.repository.ProductVariantRepository;
import com.re.ecommerce.modules.customer.dto.request.ReviewCreateRequest;
import com.re.ecommerce.modules.customer.dto.response.ReviewEligibilityResponse;
import com.re.ecommerce.modules.customer.entity.Review;
import com.re.ecommerce.modules.customer.repository.ReviewRepository;
import com.re.ecommerce.modules.order.entity.Order;
import com.re.ecommerce.modules.order.entity.OrderItem;
import com.re.ecommerce.modules.order.enums.OrderSourceChannel;
import com.re.ecommerce.modules.order.enums.OrderStatus;
import com.re.ecommerce.modules.order.repository.OrderItemRepository;
import com.re.ecommerce.modules.order.repository.OrderRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ReviewIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private BrandRepository brandRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private ProductVariantRepository variantRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private ReviewRepository reviewRepository;
    // @Autowired private PasswordEncoder passwordEncoder;

    private User savedCustomer;
    private User savedAdmin;
    private Product savedProduct;
    private OrderItem savedOrderItem;

    @BeforeEach
    void setUp() throws Exception {
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY FALSE");
        jdbcTemplate.execute("TRUNCATE TABLE reviews RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE review_status_histories RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE product_rating_summaries RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE order_items RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE orders RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE products RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE product_variants RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE users RESTART IDENTITY");
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY TRUE");
        
        setupData();
    }

    private void setupData() throws Exception {
        Brand brand = brandRepository.save(new Brand("Apple", "apple", "", ""));
        Category category = categoryRepository.save(new Category(null, "Phones", "phones", "", CategoryStatus.ACTIVE, 0));
        
        Product p = new Product(category, brand, "iPhone Review", "ip-rev", "desc");
        p.setPublicationStatus(PublicationStatus.ACTIVE);
        savedProduct = productRepository.save(p);

        ProductVariant v = variantRepository.save(new ProductVariant(savedProduct, "SKU123", "Variant 1", "Red", 8, 256, null, 12, BigDecimal.TEN, null));

        // Create uses via API to ensure full domain profile creation
        initUser("revcustomer", "revcustomer@customer.com");
        initUser("revadmin", "revadmin@admin.com");
        
        savedCustomer = userRepository.findByUsername("revcustomer").orElseThrow();
        savedAdmin = userRepository.findByUsername("revadmin").orElseThrow();

        // Promote admin
        jdbcTemplate.execute("UPDATE users SET role = 'EMPLOYEE' WHERE username = 'revadmin'");

        Order order = new Order();
        order.setOrderCode("ORD-123");
        order.setIdempotencyKeyHash(new byte[]{1,2,3});
        order.setCustomer(savedCustomer);
        order.setSourceChannel(OrderSourceChannel.WEB);
        order.setContactName("test");
        order.setContactPhone("test");
        order.setReceiverName("test");
        order.setReceiverPhone("test");
        order.setShippingCountryCode("VN");
        order.setShippingProvinceName("GN");
        order.setShippingDistrictName("GD");
        order.setShippingWardName("GW");
        order.setShippingDetailAddress("Address");
        order.setCurrency("VND");
        order.setSubtotalAmount(BigDecimal.TEN);
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setShippingFee(BigDecimal.ZERO);
        order.setGrandTotalAmount(BigDecimal.TEN);
        order.setStatus(OrderStatus.COMPLETED);
        order.setCompletedAt(LocalDateTime.now());
        order.setVersion(1L);
        Order savedOrder = orderRepository.save(order);

        OrderItem orderItem = new OrderItem(savedOrder, savedProduct, v, savedProduct.getName(), v.getName(), v.getSku(), "Red", "8", "256", null, 12, BigDecimal.TEN, 1, BigDecimal.ZERO, BigDecimal.TEN);
        savedOrderItem = orderItemRepository.save(orderItem);
    }

    private String initUser(String username, String email) throws Exception {
        String phone = "090" + String.format("%07d", new java.util.Random().nextInt(10000000));
        RegisterRequest registerReq = 
            new RegisterRequest("Test User", email, "password", phone, true);
        MvcResult registerRes = mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerReq)))
                .andReturn();
                
        String content = registerRes.getResponse().getContentAsString();
        if (registerRes.getResponse().getStatus() != 200 && registerRes.getResponse().getStatus() != 201) {
            throw new RuntimeException("Register failed! Status: " + registerRes.getResponse().getStatus() + " Content: " + content);
        }
        
        JsonNode responseNode = objectMapper.readTree(content);
        return responseNode.get("accessToken").asText();
    }

    private String getToken(String username) throws Exception {
        LoginRequest loginReq = 
            new LoginRequest(username, "password");
        MvcResult res = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode responseNode = objectMapper.readTree(res.getResponse().getContentAsString());
        return responseNode.get("accessToken").asText();
    }

    @Test
    void shouldGoThroughReviewLifecycle() throws Exception {
        String token = getToken("revcustomer");

        // 1. Eligibility contains the item
        MvcResult eligibilitiesRes = mockMvc.perform(get("/api/v1/me/review-eligibilities")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn();
        List<ReviewEligibilityResponse> eligibilities = objectMapper.readValue(
                eligibilitiesRes.getResponse().getContentAsString(),
                new TypeReference<>() {}
        );
        assertEquals(1, eligibilities.size());
        assertEquals(savedOrderItem.getId(), eligibilities.get(0).orderItemId());

        // 2. Create the review
        ReviewCreateRequest createReq = new ReviewCreateRequest(savedOrderItem.getId(), 5, "Great", "Test review");
        mockMvc.perform(post("/api/v1/products/" + savedProduct.getId() + "/reviews")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isCreated());

        // 3. Verify it's in the DB as PENDING
        List<Review> all = reviewRepository.findAll();
        assertEquals(1, all.size());
        assertEquals("PENDING", all.get(0).getStatus().name());

        // 4. Admin approves
        mockMvc.perform(post("/api/v1/admin/reviews/" + all.get(0).getId() + "/approve")
                // Using .with() to inject authorities without needing DB Role mapping logic
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user(new com.re.ecommerce.security.CustomUserDetails(savedAdmin.getUsername(), savedAdmin.getRole(), null, java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("REVIEW_MODERATE")))))
        )
        .andExpect(status().isOk());

        // 5. Verify it's APPROVED
        all = reviewRepository.findAll();
        assertEquals("APPROVED", all.get(0).getStatus().name());

        // 6. Public can see it
        mockMvc.perform(get("/api/v1/products/" + savedProduct.getSlug() + "/reviews"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content.length()").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].rating").value(5));
    }
}
