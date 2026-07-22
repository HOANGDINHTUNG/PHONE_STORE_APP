package com.re.ecommerce.modules.inventory.dto.response;

import com.re.ecommerce.modules.inventory.entity.enums.WarehouseStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record WarehouseResponse(
        UUID id,
        String code,
        String name,
        String phone,
        String address,
        WarehouseStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
