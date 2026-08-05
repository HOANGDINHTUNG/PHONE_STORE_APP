package com.re.ecommerce.modules.cart.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherAnalyticsResponse {
    private long totalVouchersCount;
    private long activeVouchersCount;
    private long totalRedemptionsCount;
    private BigDecimal totalDiscountAmountIssued;
    private BigDecimal totalVoucherDrivenRevenue;
}
