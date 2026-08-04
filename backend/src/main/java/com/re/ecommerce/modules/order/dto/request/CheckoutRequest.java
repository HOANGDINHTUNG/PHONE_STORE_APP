package com.re.ecommerce.modules.order.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import java.util.List;

@Builder
public record CheckoutRequest(
        @NotBlank(message = "Idempotency key is required")
        String idempotencyKey,
        
        String couponCode, // optional
        
        // Shipping address reference for logged-in user
        String shippingAddressId,
        
        // Guest contact data (could be null for authenticated user)
        String guestName,
        String guestPhone,
        String guestEmail,
        
        // Detailed guest address if no shippingAddressId
        String guestProvinceCode,
        String guestProvinceName,
        String guestDistrictCode,
        String guestDistrictName,
        String guestWardCode,
        String guestWardName,
        String guestDetailAddress,
        
        String note,
        
        // Direct checkout items (bypasses Cart)
        List<CheckoutItemRequest> items
) {
}
