package com.re.ecommerce.modules.inventory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.inventory.dto.request.StockAdjustmentRequest;
import com.re.ecommerce.modules.inventory.dto.request.StockImportRequest;
import com.re.ecommerce.modules.inventory.entity.InventoryUnit;
import com.re.ecommerce.modules.inventory.entity.WarehouseInventory;
import com.re.ecommerce.modules.inventory.service.InventoryService;
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

import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class InventoryControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private InventoryService inventoryService;

    @Test
    @WithMockUser(authorities = {"SCOPE_INVENTORY_MANAGE"})
    void receivePurchaseOrder_shouldReturn200() throws Exception {
        UUID poId = UUID.randomUUID();
        StockImportRequest req = new StockImportRequest(UUID.randomUUID(), Collections.emptyList());

        mockMvc.perform(post("/api/v1/inventory/receipt/purchase-order/" + poId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().is4xxClientError()); // Bad Request due to validation on items
                
        StockImportRequest.StockImportItem item = new StockImportRequest.StockImportItem(1L, 10, Collections.emptyList());
        StockImportRequest validReq = new StockImportRequest(UUID.randomUUID(), Collections.singletonList(item));

        mockMvc.perform(post("/api/v1/inventory/receipt/purchase-order/" + poId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validReq)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"SCOPE_INVENTORY_VIEW"})
    void getAvailableStockCount_shouldReturn200() throws Exception {
        UUID wid = UUID.randomUUID();
        UUID vid = UUID.randomUUID();
        when(inventoryService.getAvailableStockCount(wid, vid)).thenReturn(5);

        mockMvc.perform(get("/api/v1/inventory/warehouses/" + wid + "/variants/" + vid + "/available-count"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"SCOPE_INVENTORY_VIEW"})
    void getWarehouseInventory_shouldReturn200() throws Exception {
        UUID wid = UUID.randomUUID();
        UUID vid = UUID.randomUUID();
        when(inventoryService.getWarehouseInventory(wid, vid)).thenReturn(new WarehouseInventory());

        mockMvc.perform(get("/api/v1/inventory/warehouses/" + wid + "/variants/" + vid))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"SCOPE_INVENTORY_VIEW"})
    void listBalances_shouldReturn200() throws Exception {
        when(inventoryService.listBalances(anyInt(), anyInt())).thenReturn(new PageImpl<>(Collections.emptyList()));

        mockMvc.perform(get("/api/v1/inventory"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"SCOPE_INVENTORY_VIEW"})
    void listSerializedUnits_shouldReturn200() throws Exception {
        when(inventoryService.listSerializedUnits(anyInt(), anyInt())).thenReturn(new PageImpl<>(Collections.emptyList()));

        mockMvc.perform(get("/api/v1/inventory/units"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"SCOPE_INVENTORY_VIEW"})
    void lookupUnitByIdentifier_shouldReturn200() throws Exception {
        when(inventoryService.lookupUnitByIdentifier("ABC")).thenReturn(new InventoryUnit());

        mockMvc.perform(get("/api/v1/inventory/identifiers/ABC"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"SCOPE_INVENTORY_VIEW"})
    void listLedger_shouldReturn200() throws Exception {
        when(inventoryService.listLedger(anyInt(), anyInt())).thenReturn(new PageImpl<>(Collections.emptyList()));

        mockMvc.perform(get("/api/v1/inventory/transactions"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"SCOPE_INVENTORY_VIEW"})
    void listReservations_shouldReturn200() throws Exception {
        when(inventoryService.listReservations(anyInt(), anyInt())).thenReturn(new PageImpl<>(Collections.emptyList()));

        mockMvc.perform(get("/api/v1/inventory/stock-reservations"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"SCOPE_INVENTORY_ADJUST"})
    void createManualAdjustment_shouldReturn201() throws Exception {
        StockAdjustmentRequest req = new StockAdjustmentRequest(UUID.randomUUID(), UUID.randomUUID(), "ADJUST_IN", 10, "req", Collections.emptyList());

        mockMvc.perform(post("/api/v1/inventory/adjustments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Idempotency-Key", "id-key")
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
    }
}
