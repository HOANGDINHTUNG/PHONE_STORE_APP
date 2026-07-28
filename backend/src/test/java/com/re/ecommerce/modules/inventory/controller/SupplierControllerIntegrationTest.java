package com.re.ecommerce.modules.inventory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.inventory.dto.request.SupplierRequest;
import com.re.ecommerce.modules.inventory.dto.response.SupplierResponse;
import com.re.ecommerce.modules.inventory.entity.enums.SupplierStatus;
import com.re.ecommerce.modules.inventory.service.SupplierService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SupplierControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SupplierService supplierService;

    @Test
    @WithMockUser(authorities = {"SCOPE_SUPPLIER_VIEW"})
    void getAllSuppliers_shouldReturn200() throws Exception {
        when(supplierService.getAllSuppliers(any(), anyInt(), anyInt())).thenReturn(new PageImpl<>(Collections.emptyList()));

        mockMvc.perform(get("/api/v1/suppliers"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"SCOPE_SUPPLIER_VIEW"})
    void getSupplier_shouldReturn200() throws Exception {
        UUID id = UUID.randomUUID();
        when(supplierService.getSupplier(id)).thenReturn(new SupplierResponse(id, "C", "N", "T", "C", "P", "test@example.com", "A", SupplierStatus.ACTIVE, LocalDateTime.now(), LocalDateTime.now()));

        mockMvc.perform(get("/api/v1/suppliers/" + id))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"SCOPE_SUPPLIER_MANAGE"})
    void createSupplier_shouldReturn201() throws Exception {
        SupplierRequest req = new SupplierRequest("C", "N", "T", "C", "P", "test@example.com", "A");
        when(supplierService.createSupplier(any())).thenReturn(new SupplierResponse(UUID.randomUUID(), "C", "N", "T", "C", "P", "test@example.com", "A", SupplierStatus.ACTIVE, LocalDateTime.now(), LocalDateTime.now()));

        mockMvc.perform(post("/api/v1/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
    }

    @Test
    @WithMockUser(authorities = {"SCOPE_SUPPLIER_MANAGE"})
    void updateSupplier_shouldReturn200() throws Exception {
        UUID id = UUID.randomUUID();
        SupplierRequest req = new SupplierRequest("C", "N", "T", "C", "P", "test@example.com", "A");
        
        mockMvc.perform(put("/api/v1/suppliers/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"SCOPE_SUPPLIER_MANAGE"})
    void changeStatus_shouldReturn200() throws Exception {
        UUID id = UUID.randomUUID();
        
        mockMvc.perform(patch("/api/v1/suppliers/" + id + "/status")
                        .param("status", "INACTIVE"))
                .andExpect(status().isOk());
    }
}
