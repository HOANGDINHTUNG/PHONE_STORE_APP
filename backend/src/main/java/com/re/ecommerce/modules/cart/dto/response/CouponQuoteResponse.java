package com.re.ecommerce.modules.cart.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponQuoteResponse {
    private UUID couponId;
    private String couponCode;
    private String couponName;
    private BigDecimal subtotal;
    private BigDecimal discountValue;
    private BigDecimal eligibleSubtotal;
    private BigDecimal discountAmount;
    private BigDecimal grandTotal;
    private BigDecimal grandTotalPreview;
    private List<String> rejectedItemReasons;
}
