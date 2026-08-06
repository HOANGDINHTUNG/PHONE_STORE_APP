package com.re.ecommerce.modules.order.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.auth.entity.CustomerProfile;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.CustomerProfileRepository;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.cart.entity.Cart;
import com.re.ecommerce.modules.cart.entity.CartItem;
import com.re.ecommerce.modules.cart.repository.CartRepository;
import com.re.ecommerce.modules.catalog.entity.Brand;
import com.re.ecommerce.modules.catalog.entity.Category;
import com.re.ecommerce.modules.catalog.entity.Product;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.catalog.repository.BrandRepository;
import com.re.ecommerce.modules.catalog.repository.CategoryRepository;
import com.re.ecommerce.modules.catalog.repository.ProductRepository;
import com.re.ecommerce.modules.catalog.repository.ProductVariantRepository;
import com.re.ecommerce.modules.order.dto.request.CheckoutRequest;
import com.re.ecommerce.modules.order.entity.Order;
import com.re.ecommerce.modules.order.enums.OrderSourceChannel;
import com.re.ecommerce.modules.order.enums.OrderStatus;
import com.re.ecommerce.modules.order.repository.OrderRepository;
import com.re.ecommerce.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class OrderControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerProfileRepository customerProfileRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private com.re.ecommerce.modules.order.repository.OrderItemRepository orderItemRepository;


    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    private String userToken;
    private String adminToken;
    private User testUser;
    private CustomerProfile testProfile;
    private ProductVariant testVariant;

    @BeforeEach
    void setUp() {
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY FALSE");
        jdbcTemplate.execute("TRUNCATE TABLE order_items RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE orders RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE cart_items RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE carts RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE customer_profiles RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE users RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE product_variants RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE products RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE brands RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE categories RESTART IDENTITY");
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY TRUE");

        testUser = new User("orderuser", "orderuser@example.com", "password", "USER");
        testUser = userRepository.save(testUser);

        testProfile = new CustomerProfile(testUser, "CUST-ORDER-001");
        testProfile = customerProfileRepository.save(testProfile);

        userToken = jwtUtils.generateToken("orderuser", "USER");
        adminToken = jwtUtils.generateToken("adminuser", "ADMIN");

        Category cat = new Category(null, "TestCat", "test-cat", "desc", com.re.ecommerce.modules.catalog.entity.CategoryStatus.ACTIVE, 0);
        categoryRepository.save(cat);
        Brand brand = new Brand("TestBrand", "test-brand", "logo", "desc");
        brandRepository.save(brand);
        Product product = new Product(cat, brand, "TestProd", "test-prod", "desc");
        product.setPublicationStatus(com.re.ecommerce.modules.catalog.entity.PublicationStatus.ACTIVE);
        productRepository.save(product);
        
        testVariant = new ProductVariant(product, "SKU123", "Variant 1", "Black", 8, 256, null, 12, BigDecimal.valueOf(100), BigDecimal.valueOf(100));
        productVariantRepository.save(testVariant);
    }

    @Test
    void checkout_shouldReturn409_whenEmptyCart() throws Exception {
        CheckoutRequest request = CheckoutRequest.builder()
                .idempotencyKey("idem-test-409")
                .guestName("Guest")
                .guestPhone("0909090909")
                .guestEmail("guest@example.com")
                .guestProvinceCode("01")
                .guestProvinceName("PRV")
                .guestDistrictCode("001")
                .guestDistrictName("DIS")
                .guestWardCode("00001")
                .guestWardName("WAR")
                .guestDetailAddress("123 Street")
                .note("Note")
                .build();

        mockMvc.perform(post("/api/v1/orders/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .header("X-Guest-Cart-Token", "non-existent-token"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.errorCode").isNotEmpty());
    }

    @Test
    void checkout_shouldCreateOrder_whenValidCartLoggedUser() throws Exception {
        Cart cart = new Cart();
        cart.setCustomer(testProfile);
        
        CartItem item = new CartItem();
        item.setProductVariant(testVariant);
        item.setQuantity(2);
        cart.addItem(item); // ensure it's in memory

        cart = cartRepository.save(cart);

        CheckoutRequest request = CheckoutRequest.builder()
                .idempotencyKey("idem-checkout-test-ok")
                .guestName("User")
                .guestPhone("0909090909")
                .guestEmail("user@example.com")
                .guestProvinceCode("01")
                .guestProvinceName("PRV")
                .guestDistrictCode("001")
                .guestDistrictName("DIS")
                .guestWardCode("00001")
                .guestWardName("WAR")
                .guestDetailAddress("123 Street")
                .note("Note")
                .build();

        mockMvc.perform(post("/api/v1/orders/checkout")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orderCode").isNotEmpty())
                .andExpect(jsonPath("$.grandTotalAmount").value(200.0));
    }

    @Test
    void getMyOrders_shouldReturnPage() throws Exception {
        Order order = new Order();
        order.setCustomer(testUser);
        order.setOrderCode("ORD-1234");
        order.setIdempotencyKeyHash(new byte[32]);
        order.setSubtotalAmount(BigDecimal.valueOf(100));
        order.setGrandTotalAmount(BigDecimal.valueOf(100));
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setShippingFee(BigDecimal.ZERO);
        order.setSourceChannel(OrderSourceChannel.WEB);
        order.setReceiverName("Rec");
        order.setReceiverPhone("090");
        order.setContactName("Con");
        order.setContactPhone("090");
        order.setShippingCountryCode("VN");
        order.setShippingProvinceName("PRV");
        order.setShippingDistrictName("DIS");
        order.setShippingWardName("WAR");
        order.setShippingDetailAddress("Address");
        order.setCurrency("VND");
        order.setStatus(OrderStatus.PENDING);
        order.setVersion(0L);
        order = orderRepository.save(order);

        mockMvc.perform(get("/api/v1/me/orders")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].orderCode").value("ORD-1234"));
    }

    @Test
    void getMyOrders_shouldReturnEmptyPage_whenUserHasNoOrders() throws Exception {
        mockMvc.perform(get("/api/v1/me/orders")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(0)));
    }

    @Test
    void getMyOrder_shouldReturnDetails() throws Exception {
        Order order = new Order();
        order.setCustomer(testUser);
        order.setOrderCode("ORD-12345");
        order.setIdempotencyKeyHash(new byte[32]);
        order.setSubtotalAmount(BigDecimal.valueOf(100));
        order.setGrandTotalAmount(BigDecimal.valueOf(100));
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setShippingFee(BigDecimal.ZERO);
        order.setSourceChannel(OrderSourceChannel.WEB);
        order.setReceiverName("Rec");
        order.setReceiverPhone("090");
        order.setContactName("Con");
        order.setContactPhone("090");
        order.setShippingCountryCode("VN");
        order.setShippingProvinceName("PRV");
        order.setShippingDistrictName("DIS");
        order.setShippingWardName("WAR");
        order.setShippingDetailAddress("Address");
        order.setCurrency("VND");
        order.setStatus(OrderStatus.PENDING);
        order.setVersion(0L);
        order = orderRepository.save(order);

        mockMvc.perform(get("/api/v1/me/orders/ORD-12345")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderCode").value("ORD-12345"));
    }
    
    @Test
    void getMyOrder_shouldReturn404ForOthersOrder() throws Exception {
        Order order = new Order();
        order.setOrderCode("ORD-OTHER");
        order.setIdempotencyKeyHash(new byte[32]);
        order.setSubtotalAmount(BigDecimal.valueOf(100));
        order.setGrandTotalAmount(BigDecimal.valueOf(100));
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setShippingFee(BigDecimal.ZERO);
        order.setSourceChannel(OrderSourceChannel.WEB);
        order.setReceiverName("Rec");
        order.setReceiverPhone("090");
        order.setContactName("Con");
        order.setContactPhone("090");
        order.setShippingCountryCode("VN");
        order.setShippingProvinceName("PRV");
        order.setShippingDistrictName("DIS");
        order.setShippingWardName("WAR");
        order.setShippingDetailAddress("Address");
        order.setCurrency("VND");
        order.setStatus(OrderStatus.PENDING);
        order.setVersion(0L);
        order = orderRepository.save(order);

        mockMvc.perform(get("/api/v1/me/orders/ORD-OTHER")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAdminOrders_shouldReturnPage() throws Exception {
        Order order = new Order();
        order.setOrderCode("ORD-ADMIN");
        order.setIdempotencyKeyHash(new byte[32]);
        order.setSubtotalAmount(BigDecimal.valueOf(100));
        order.setGrandTotalAmount(BigDecimal.valueOf(100));
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setShippingFee(BigDecimal.ZERO);
        order.setSourceChannel(OrderSourceChannel.WEB);
        order.setReceiverName("Rec");
        order.setReceiverPhone("090");
        order.setContactName("Con");
        order.setContactPhone("090");
        order.setShippingCountryCode("VN");
        order.setShippingProvinceName("PRV");
        order.setShippingDistrictName("DIS");
        order.setShippingWardName("WAR");
        order.setShippingDetailAddress("Address");
        order.setCurrency("VND");
        order.setStatus(OrderStatus.PENDING);
        order.setVersion(0L);
        order = orderRepository.save(order);

        mockMvc.perform(get("/api/v1/admin/orders")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].orderCode").value("ORD-ADMIN"));
    }

    @Test
    void reorder_shouldMergeItemsIntoCart() throws Exception {
        Order order = new Order();
        order.setCustomer(testUser);
        order.setOrderCode("ORD-REORDER-OK");
        order.setIdempotencyKeyHash(new byte[32]);
        order.setSubtotalAmount(BigDecimal.valueOf(100));
        order.setGrandTotalAmount(BigDecimal.valueOf(100));
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setShippingFee(BigDecimal.ZERO);
        order.setSourceChannel(OrderSourceChannel.WEB);
        order.setReceiverName("Rec");
        order.setReceiverPhone("090");
        order.setContactName("Con");
        order.setContactPhone("090");
        order.setShippingCountryCode("VN");
        order.setShippingProvinceName("PRV");
        order.setShippingDistrictName("DIS");
        order.setShippingWardName("WAR");
        order.setShippingDetailAddress("Address");
        order.setCurrency("VND");
        order.setStatus(OrderStatus.PENDING);
        order.setVersion(0L);
        order = orderRepository.save(order);
        
        com.re.ecommerce.modules.order.entity.OrderItem oi = com.re.ecommerce.modules.order.entity.OrderItem.builder()
                .order(order)
                .product(testVariant.getProduct())
                .productVariant(testVariant)
                .productName("TestProd")
                .variantName("Variant 1")
                .sku("SKU123")
                .unitPrice(BigDecimal.valueOf(100))
                .discountAmount(BigDecimal.ZERO)
                .warrantyMonths(12)
                .quantity(3)
                .build();
        orderItemRepository.save(oi);
        
        // Cart setup: current cart has 1 of testVariant
        Cart cart = new Cart();
        cart.setCustomer(testProfile);
        CartItem item = new CartItem();
        item.setProductVariant(testVariant);
        item.setQuantity(1);
        cart.addItem(item);
        cartRepository.save(cart);

        mockMvc.perform(post("/api/v1/me/orders/ORD-REORDER-OK/reorder")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].quantity").value(3)); // Max of 1 and 3 is 3
    }
    
    @Test
    void reorder_shouldReturn422WhenNoValidItems() throws Exception {
        Order order = new Order();
        order.setCustomer(testUser);
        order.setOrderCode("ORD-REORDER-422");
        order.setIdempotencyKeyHash(new byte[32]);
        order.setSubtotalAmount(BigDecimal.valueOf(100));
        order.setGrandTotalAmount(BigDecimal.valueOf(100));
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setShippingFee(BigDecimal.ZERO);
        order.setSourceChannel(OrderSourceChannel.WEB);
        order.setReceiverName("Rec");
        order.setReceiverPhone("090");
        order.setContactName("Con");
        order.setContactPhone("090");
        order.setShippingCountryCode("VN");
        order.setShippingProvinceName("PRV");
        order.setShippingDistrictName("DIS");
        order.setShippingWardName("WAR");
        order.setShippingDetailAddress("Address");
        order.setCurrency("VND");
        order.setStatus(OrderStatus.PENDING);
        order.setVersion(0L);
        order = orderRepository.save(order);
        
        ProductVariant inactiveVariant = new ProductVariant(testVariant.getProduct(), "SKU422", "Variant 422", "Green", 8, 256, null, 12, BigDecimal.valueOf(100), BigDecimal.valueOf(100));
        inactiveVariant.setStatus(com.re.ecommerce.modules.catalog.entity.VariantStatus.INACTIVE);
        inactiveVariant = productVariantRepository.save(inactiveVariant);
        
        com.re.ecommerce.modules.order.entity.OrderItem oi = com.re.ecommerce.modules.order.entity.OrderItem.builder()
                .order(order)
                .product(testVariant.getProduct())
                .productVariant(inactiveVariant)
                .productName("TestProd")
                .variantName("Variant 422")
                .sku("SKU422")
                .unitPrice(BigDecimal.valueOf(100))
                .discountAmount(BigDecimal.ZERO)
                .warrantyMonths(12)
                .quantity(3)
                .build();
        orderItemRepository.save(oi);
        
        mockMvc.perform(post("/api/v1/me/orders/ORD-REORDER-422/reorder")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.errorCode").value("NO_REORDERABLE_ITEMS"));
    }
}
