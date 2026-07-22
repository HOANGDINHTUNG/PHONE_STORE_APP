package com.re.ecommerce.modules.inventory.dto.response;

import com.re.ecommerce.modules.inventory.entity.enums.SupplierStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record SupplierResponse(
        UUID id,
        String supplierCode,
        String name,
        String taxCode,
        String contactName,
        String phone,
        String email,
        String address,
        SupplierStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
