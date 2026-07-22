package com.re.ecommerce.modules.customer.controller;

import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.auth.entity.CustomerProfile;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.CustomerProfileRepository;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.customer.dto.request.AddressCreateRequest;
import com.re.ecommerce.modules.customer.entity.ShippingAddress;
import com.re.ecommerce.modules.customer.repository.ShippingAddressRepository;
import com.re.ecommerce.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class ShippingAddressControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ShippingAddressRepository addressRepository;

    @Autowired
    private CustomerProfileRepository customerProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Autowired
    private JwtUtils jwtUtils;

    private String userToken;
    private String adminToken;
    private User testUser;
    private CustomerProfile testCustomer;

    @BeforeEach
    void setUp() throws Exception {
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY FALSE");
        jdbcTemplate.execute("TRUNCATE TABLE password_reset_tokens RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE email_verification_tokens RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE refresh_tokens RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE customer_profiles RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE staff_profiles RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE shipping_addresses RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE users RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE positions RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE departments RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE roles RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE permissions RESTART IDENTITY");
        jdbcTemplate.execute("TRUNCATE TABLE categories RESTART IDENTITY");
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY TRUE");

userToken = jwtUtils.generateToken("regularuser", "USER");
        adminToken = jwtUtils.generateToken("adminuser", "ADMIN");

        testUser = new User("regularuser", "user@test.com", "hash", "USER");
        testUser = userRepository.save(testUser);
        
        testCustomer = new CustomerProfile(testUser, "CUST-001");
        testCustomer = customerProfileRepository.save(testCustomer);
    }

    // Security Test - Endpoint should block missing tokens
    @Test
    void listAddresses_shouldDenyWithoutToken() throws Exception {
        mockMvc.perform(get("/api/v1/me/shipping-addresses"))
                .andExpect(status().isForbidden()); // Spring security typically throws 403 for anonymous when denied
    }

    // Security Test - Endpoint should block Admin tokens as it requires ROLE_USER
    @Test
    void listAddresses_shouldDenyForAdmin() throws Exception {
        mockMvc.perform(get("/api/v1/me/shipping-addresses")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isForbidden());
    }

    // Happy Path - Get list of addresses for the user
    @Test
    void listAddresses_shouldReturnActiveAddresses() throws Exception {
        ShippingAddress address = new ShippingAddress(testCustomer, "John Doe", "0909", "HCM", "Quan 1", "Ben Nghe", "123 Le Loi");
        addressRepository.save(address);

        mockMvc.perform(get("/api/v1/me/shipping-addresses")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].receiverName").value("John Doe"));
    }

    // Validation Test - Missing mandated fields should throw 400 Bad Request
    @Test
    void createAddress_shouldReturn400OnMissingFields() throws Exception {
        AddressCreateRequest malformedRequest = new AddressCreateRequest(
                "", // Blank receiver name
                "099", "VN", "PROV", "Prov", "DIST", "Dist", "WARD", "Ward", "Detail", "000", false
        );

        mockMvc.perform(post("/api/v1/me/shipping-addresses")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(malformedRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value("VALIDATION_FAILED"));
    }

    // Happy Path - Create successfully returns created and fields match
    @Test
    void createAddress_shouldReturn201OnSuccess() throws Exception {
        AddressCreateRequest validRequest = new AddressCreateRequest(
                "Jane Doe", "0888", "VN", "HN", "Ha Noi", "BD", "Ba Dinh", "TL", "Truc Bach", "456 Yen Phu", "100000", false
        );

        mockMvc.perform(post("/api/v1/me/shipping-addresses")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.receiverName").value("Jane Doe"))
                .andExpect(jsonPath("$.isDefault").value(true)); // implicitly default
    }

    // Boundary Test - Attempting to access an address that doesn't exist or isn't owned
    @Test
    void getAddress_shouldReturn404OnInvalidOwnedId() throws Exception {
        mockMvc.perform(get("/api/v1/me/shipping-addresses/" + UUID.randomUUID())
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.errorCode").value("ADDRESS_NOT_FOUND"));
    }

    // Delete Test - Should soft delete
    @Test
    void deleteAddress_shouldReturn204AndSoftDelete() throws Exception {
        ShippingAddress address = new ShippingAddress(testCustomer, "John Doe", "0909", "HCM", "Quan 1", "Ben Nghe", "123 Le Loi");
        addressRepository.save(address);

        mockMvc.perform(delete("/api/v1/me/shipping-addresses/" + address.getId())
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/me/shipping-addresses/" + address.getId())
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAddress_shouldReturn200OK() throws Exception {
        ShippingAddress address = new ShippingAddress(testCustomer, "John Doe", "0909", "HCM", "Quan 1", "Ben Nghe", "123 Le Loi");
        addressRepository.save(address);

        mockMvc.perform(get("/api/v1/me/shipping-addresses/" + address.getId())
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.receiverName").value("John Doe"));
    }

    @Test
    void updateAddress_shouldReturn200OnSuccess() throws Exception {
        ShippingAddress address = new ShippingAddress(testCustomer, "Old Name", "0909", "HCM", "Quan 1", "Ben Nghe", "123 Le Loi");
        addressRepository.save(address);

        mockMvc.perform(patch("/api/v1/me/shipping-addresses/" + address.getId())
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"receiverName\": \"New Name\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.receiverName").value("New Name"));
    }

    @Test
    void updateAddress_shouldReturn404OnNotFound() throws Exception {
        mockMvc.perform(patch("/api/v1/me/shipping-addresses/" + UUID.randomUUID())
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"receiverName\": \"New Name\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void setDefaultAddress_shouldReturn204OnSuccess() throws Exception {
        ShippingAddress address = new ShippingAddress(testCustomer, "John Doe", "0909", "HCM", "Quan 1", "Ben Nghe", "123 Le Loi");
        address.setDefault(false);
        addressRepository.save(address);

        mockMvc.perform(post("/api/v1/me/shipping-addresses/" + address.getId() + "/set-default")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isNoContent());
                
        mockMvc.perform(get("/api/v1/me/shipping-addresses/" + address.getId())
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(jsonPath("$.isDefault").value(true));
    }
}




