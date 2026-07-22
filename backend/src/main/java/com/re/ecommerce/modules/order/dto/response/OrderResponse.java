package com.re.ecommerce.modules.order.dto.response;

import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Builder
public record OrderResponse(
        UUID id,
        String orderCode,
        String customerId,
        String sourceChannel,
        String couponCode,
        
        String contactName,
        String contactEmail,
        String contactPhone,
        
        String receiverName,
        String receiverPhone,
        String shippingDetailAddress,
        String shippingWardName,
        String shippingDistrictName,
        String shippingProvinceName,
        
        String currency,
        BigDecimal subtotalAmount,
        BigDecimal discountAmount,
        BigDecimal shippingFee,
        BigDecimal grandTotalAmount,
        
        String status,
        String note,
        
        LocalDateTime createdAt,
        LocalDateTime confirmedAt,
        LocalDateTime completedAt,
        LocalDateTime cancelledAt,
        
        List<OrderItemResponse> items
) {
}
