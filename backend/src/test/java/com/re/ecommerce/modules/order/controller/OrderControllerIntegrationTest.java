package com.re.ecommerce.modules.order.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.cart.entity.Cart;
import com.re.ecommerce.modules.cart.repository.CartRepository;
import com.re.ecommerce.modules.order.dto.request.CheckoutRequest;
import com.re.ecommerce.modules.order.repository.OrderRepository;
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

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class OrderControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        // Additional setup if necessary
    }

    @AfterEach
    void tearDown() {
        orderRepository.deleteAll();
        cartRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void checkout_shouldReturn409_whenEmptyCart() throws Exception {
        CheckoutRequest request = CheckoutRequest.builder()
                .idempotencyKey("idem-test-400")
                .guestName("Guest")
                .guestPhone("0909090909")
                .guestEmail("guest@example.com")
                .guestProvinceCode("01")
                .guestDistrictCode("001")
                .guestWardCode("00001")
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
}
