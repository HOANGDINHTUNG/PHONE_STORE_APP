package com.re.ecommerce.modules.inventory.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record PurchaseOrderRequest(
        @NotBlank(message = "Mã Purchase Order không được để trống")
        @Size(max = 50, message = "Mã Purchase Order tối đa 50 ký tự")
        String purchaseOrderCode,

        @NotNull(message = "Supplier ID không được để trống")
        UUID supplierId,

        @NotNull(message = "Warehouse ID không được để trống")
        UUID warehouseId,

        LocalDateTime expectedAt,
        
        @Size(max = 5000, message = "Ghi chú không được vượt quá 5000 ký tự")
        String note,

        @NotEmpty(message = "Danh sách sản phẩm nhập không được để trống")
        @Valid
        List<PurchaseOrderItemRequest> items
) {
}
