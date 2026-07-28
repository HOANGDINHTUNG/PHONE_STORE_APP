package com.re.ecommerce.modules.inventory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.inventory.dto.request.WarehouseRequest;
import com.re.ecommerce.modules.inventory.dto.response.WarehouseResponse;
import com.re.ecommerce.modules.inventory.entity.enums.WarehouseStatus;
import com.re.ecommerce.modules.inventory.service.WarehouseService;
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
public class WarehouseControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private WarehouseService warehouseService;

    @Test
    @WithMockUser(authorities = {"SCOPE_WAREHOUSE_VIEW"})
    void getAllWarehouses_shouldReturn200() throws Exception {
        when(warehouseService.getAllWarehouses(any(), anyInt(), anyInt())).thenReturn(new PageImpl<>(Collections.emptyList()));

        mockMvc.perform(get("/api/v1/warehouses"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"SCOPE_WAREHOUSE_VIEW"})
    void getWarehouse_shouldReturn200() throws Exception {
        UUID id = UUID.randomUUID();
        when(warehouseService.getWarehouse(id)).thenReturn(new WarehouseResponse(id, "W01", "Name", "123", "Addr", WarehouseStatus.ACTIVE, LocalDateTime.now(), LocalDateTime.now()));

        mockMvc.perform(get("/api/v1/warehouses/" + id))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"SCOPE_WAREHOUSE_MANAGE"})
    void createWarehouse_shouldReturn201() throws Exception {
        WarehouseRequest req = new WarehouseRequest("W01", "Name", "123", "Addr");
        when(warehouseService.createWarehouse(any())).thenReturn(new WarehouseResponse(UUID.randomUUID(), "W01", "Name", "123", "Addr", WarehouseStatus.ACTIVE, LocalDateTime.now(), LocalDateTime.now()));

        mockMvc.perform(post("/api/v1/warehouses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
    }

    @Test
    @WithMockUser(authorities = {"SCOPE_WAREHOUSE_MANAGE"})
    void updateWarehouse_shouldReturn200() throws Exception {
        UUID id = UUID.randomUUID();
        WarehouseRequest req = new WarehouseRequest("W01", "Name", "123", "Addr");
        
        mockMvc.perform(put("/api/v1/warehouses/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"SCOPE_WAREHOUSE_MANAGE"})
    void changeStatus_shouldReturn200() throws Exception {
        UUID id = UUID.randomUUID();
        
        mockMvc.perform(patch("/api/v1/warehouses/" + id + "/status")
                        .param("status", "INACTIVE"))
                .andExpect(status().isOk());
    }
}
