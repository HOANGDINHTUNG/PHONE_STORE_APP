package com.re.ecommerce.modules.cart.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.cart.dto.request.CouponCreateRequest;
import com.re.ecommerce.modules.cart.entity.Coupon;
import com.re.ecommerce.modules.cart.entity.CouponStatus;
import com.re.ecommerce.modules.cart.entity.CouponType;
import com.re.ecommerce.modules.cart.repository.CouponRepository;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.auth.service.AuthService;
import com.re.ecommerce.modules.auth.dto.request.LoginRequest;
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
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AdminCouponControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthService authService;

    private String adminToken;
    private Coupon testCoupon;

    @BeforeEach
    void setUp() {
        cleanDb();
        
        // Setup Admin User
        userRepository.findByUsername("admincoupon").orElseGet(() -> {
            User u = new User("admincoupon", "admincoupon@test.com", passwordEncoder.encode("password"), "ADMIN");
            return userRepository.save(u);
        });
        
        // Get JWT Token
        try {
            LoginRequest loginReq = new LoginRequest("admincoupon", "password");
            adminToken = authService.login(loginReq, "test-fingerprint", "127.0.0.1").accessToken();
        } catch (Exception e) {
            throw new RuntimeException("Failed to login", e);
        }

        // Setup Test Coupon
        testCoupon = new Coupon();
        testCoupon.setCode("SUMMER2026");
        testCoupon.setType(CouponType.PERCENT);
        testCoupon.setDiscountValue(new BigDecimal("10.00"));
        testCoupon.setAppliesToAll(true);
        testCoupon.setStartTime(LocalDateTime.now().minusDays(1));
        testCoupon.setEndTime(LocalDateTime.now().plusDays(10));
        testCoupon.setStatus(CouponStatus.ACTIVE);
        try {
            testCoupon = couponRepository.save(testCoupon);
        } catch (Exception e) {
            System.err.println(e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("ERROR: " + e.getCause().getCause().getMessage(), e);
        }
    }

    @AfterEach
    void tearDown() {
        cleanDb();
    }
    
    private void cleanDb() {
        couponRepository.deleteAll();
    }

    @Test
    void searchCoupons_shouldReturnList() throws Exception {
        mockMvc.perform(get("/api/v1/admin/coupons")
                .header("Authorization", "Bearer " + adminToken)
                .param("code", "SUMMER2026"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].code").value("SUMMER2026"));
    }

    @Test
    void createCoupon_shouldSuccess() throws Exception {
        CouponCreateRequest request = new CouponCreateRequest();
        request.setCode("NEWYEAR");
        request.setType(CouponType.AMOUNT);
        request.setDiscountValue(new BigDecimal("50.00"));
        request.setAppliesToAll(true);
        request.setStartTime(LocalDateTime.now().plusDays(1));
        request.setEndTime(LocalDateTime.now().plusDays(5));
        request.setMinimumOrderValue(new BigDecimal("100.00"));

        mockMvc.perform(post("/api/v1/admin/coupons")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("NEWYEAR"))
                .andExpect(jsonPath("$.discountValue").value(
                    org.hamcrest.Matchers.anyOf(
                        org.hamcrest.Matchers.is(50),
                        org.hamcrest.Matchers.is(50.0),
                        org.hamcrest.Matchers.equalTo(50.00),
                        org.hamcrest.Matchers.equalTo(50.0)
                    )
                ));
    }
}
