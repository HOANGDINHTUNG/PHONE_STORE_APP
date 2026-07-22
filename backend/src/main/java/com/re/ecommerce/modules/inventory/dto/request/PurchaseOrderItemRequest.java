package com.re.ecommerce.modules.inventory.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public record PurchaseOrderItemRequest(
        @NotNull(message = "Product Variant ID không được để trống")
        UUID productVariantId,

        @NotNull(message = "Số lượng nhập không được để trống")
        @Positive(message = "Số lượng nhập phải lớn hơn 0")
        Integer orderedQuantity,

        @NotNull(message = "Đơn giá nhập không được để trống")
        @Min(value = 0, message = "Đơn giá nhập phải lớn hơn hoặc bằng 0")
        BigDecimal unitCost
) {
}
