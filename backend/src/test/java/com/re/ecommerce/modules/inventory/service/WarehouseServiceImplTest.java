package com.re.ecommerce.modules.inventory.service;

import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.inventory.dto.request.WarehouseRequest;
import com.re.ecommerce.modules.inventory.dto.response.WarehouseResponse;
import com.re.ecommerce.modules.inventory.entity.Warehouse;
import com.re.ecommerce.modules.inventory.entity.enums.WarehouseStatus;
import com.re.ecommerce.modules.inventory.repository.WarehouseRepository;
import com.re.ecommerce.modules.inventory.service.impl.WarehouseServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class WarehouseServiceImplTest {

    @Mock
    private WarehouseRepository warehouseRepository;

    @InjectMocks
    private WarehouseServiceImpl warehouseService;

    private Warehouse warehouse;
    private final UUID warehouseId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        warehouse = new Warehouse();
        warehouse.setId(warehouseId);
        warehouse.setCode("WH01");
        warehouse.setName("Warehouse A");
        warehouse.setStatus(WarehouseStatus.ACTIVE);
    }

    @Test
    void getAllWarehouses_WithStatus_ReturnsPagedResponse() {
        when(warehouseRepository.findByStatus(eq(WarehouseStatus.ACTIVE), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(warehouse)));

        Page<WarehouseResponse> result = warehouseService.getAllWarehouses(WarehouseStatus.ACTIVE, 1, 10);
        assertEquals(1, result.getTotalElements());
        assertEquals("WH01", result.getContent().get(0).code());
    }

    @Test
    void getAllWarehouses_WithoutStatus_ReturnsPagedResponse() {
        when(warehouseRepository.findAll(any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(warehouse)));

        Page<WarehouseResponse> result = warehouseService.getAllWarehouses(null, 1, 10);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void getWarehouse_Success() {
        when(warehouseRepository.findById(warehouseId)).thenReturn(Optional.of(warehouse));
        
        WarehouseResponse result = warehouseService.getWarehouse(warehouseId);
        assertEquals(warehouseId, result.id());
    }

    @Test
    void getWarehouse_NotFound_ThrowsException() {
        when(warehouseRepository.findById(warehouseId)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> warehouseService.getWarehouse(warehouseId));
    }

    @Test
    void createWarehouse_Success() {
        WarehouseRequest request = new WarehouseRequest("WH02", "Warehouse B", "123", "Addr");
        when(warehouseRepository.findByCode(request.code())).thenReturn(Optional.empty());
        when(warehouseRepository.findByName(request.name())).thenReturn(Optional.empty());
        when(warehouseRepository.save(any(Warehouse.class))).thenAnswer(i -> {
            Warehouse w = i.getArgument(0);
            w.setId(UUID.randomUUID());
            return w;
        });

        WarehouseResponse result = warehouseService.createWarehouse(request);
        assertEquals("WH02", result.code());
    }

    @Test
    void createWarehouse_CodeExists_ThrowsException() {
        WarehouseRequest request = new WarehouseRequest("WH01", "Warehouse B", "123", "Addr");
        when(warehouseRepository.findByCode(request.code())).thenReturn(Optional.of(new Warehouse()));
        assertThrows(BusinessConflictException.class, () -> warehouseService.createWarehouse(request));
    }

    @Test
    void createWarehouse_NameExists_ThrowsException() {
        WarehouseRequest request = new WarehouseRequest("WH02", "Warehouse A", "123", "Addr");
        when(warehouseRepository.findByCode(request.code())).thenReturn(Optional.empty());
        when(warehouseRepository.findByName(request.name())).thenReturn(Optional.of(new Warehouse()));
        assertThrows(BusinessConflictException.class, () -> warehouseService.createWarehouse(request));
    }

    @Test
    void updateWarehouse_Success() {
        WarehouseRequest request = new WarehouseRequest("WH02", "Warehouse B", "123", "Addr");
        when(warehouseRepository.findById(warehouseId)).thenReturn(Optional.of(warehouse));
        when(warehouseRepository.findByCode(request.code())).thenReturn(Optional.empty());
        when(warehouseRepository.findByName(request.name())).thenReturn(Optional.empty());
        when(warehouseRepository.save(any(Warehouse.class))).thenAnswer(i -> i.getArgument(0));

        WarehouseResponse result = warehouseService.updateWarehouse(warehouseId, request);
        assertEquals("WH02", result.code());
    }

    @Test
    void updateWarehouse_CodeChangedExists_ThrowsException() {
        WarehouseRequest request = new WarehouseRequest("WH_EXIST", "Warehouse B", "123", "Addr");
        when(warehouseRepository.findById(warehouseId)).thenReturn(Optional.of(warehouse));
        when(warehouseRepository.findByCode(request.code())).thenReturn(Optional.of(new Warehouse()));
        assertThrows(BusinessConflictException.class, () -> warehouseService.updateWarehouse(warehouseId, request));
    }

    @Test
    void updateWarehouse_NameChangedExists_ThrowsException() {
        WarehouseRequest request = new WarehouseRequest("WH01", "Warehouse EXIST", "123", "Addr");
        when(warehouseRepository.findById(warehouseId)).thenReturn(Optional.of(warehouse));
        when(warehouseRepository.findByName(request.name())).thenReturn(Optional.of(new Warehouse()));
        assertThrows(BusinessConflictException.class, () -> warehouseService.updateWarehouse(warehouseId, request));
    }

    @Test
    void changeStatus_Success() {
        when(warehouseRepository.findById(warehouseId)).thenReturn(Optional.of(warehouse));
        when(warehouseRepository.save(any(Warehouse.class))).thenAnswer(i -> i.getArgument(0));

        WarehouseResponse result = warehouseService.changeStatus(warehouseId, WarehouseStatus.INACTIVE);
        assertEquals(WarehouseStatus.INACTIVE, result.status());
    }
}
