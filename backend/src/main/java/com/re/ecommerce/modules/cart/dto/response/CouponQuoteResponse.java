package com.re.ecommerce.modules.cart.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CouponQuoteResponse {
    private String couponCode;
    private BigDecimal eligibleSubtotal;
    private BigDecimal discountAmount;
    private BigDecimal grandTotalPreview;
    private List<String> rejectedItemReasons;
}
