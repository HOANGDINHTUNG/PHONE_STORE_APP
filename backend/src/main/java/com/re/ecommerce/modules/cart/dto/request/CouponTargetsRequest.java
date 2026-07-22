package com.re.ecommerce.modules.cart.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class CouponTargetsRequest {
    
    @NotNull(message = "Brand IDs list cannot be null")
    private List<UUID> brandIds;
    
    @NotNull(message = "Category IDs list cannot be null")
    private List<UUID> categoryIds;
    
    @NotNull(message = "Product IDs list cannot be null")
    private List<UUID> productIds;
}
