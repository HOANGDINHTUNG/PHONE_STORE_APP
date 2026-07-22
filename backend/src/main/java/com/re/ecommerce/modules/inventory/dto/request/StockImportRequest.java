package com.re.ecommerce.modules.inventory.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public record StockImportRequest(
        @NotNull(message = "Người thực hiện không được trống")
        UUID receivedBy,
        
        @NotEmpty(message = "Danh sách items nhận không được rỗng")
        @Valid
        List<StockImportItem> items
) {
    public record StockImportItem(
            @NotNull(message = "Order item ID không được trống")
            Long purchaseOrderItemId,
            
            @NotNull(message = "Số lượng nhập không được trống")
            @Positive(message = "Số lượng nhập phải lớn hơn 0")
            Integer quantity,
            
            // Map of Serial numbers for tracking
            List<Map<String, String>> identifiers
    ) {}
}
