package com.re.ecommerce.modules.inventory.service;

import com.re.ecommerce.modules.inventory.dto.request.WarehouseRequest;
import com.re.ecommerce.modules.inventory.dto.response.WarehouseResponse;
import com.re.ecommerce.modules.inventory.entity.enums.WarehouseStatus;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface WarehouseService {

    Page<WarehouseResponse> getAllWarehouses(WarehouseStatus status, int page, int size);

    WarehouseResponse getWarehouse(UUID id);

    WarehouseResponse createWarehouse(WarehouseRequest request);

    WarehouseResponse updateWarehouse(UUID id, WarehouseRequest request);

    WarehouseResponse changeStatus(UUID id, WarehouseStatus status);
}
