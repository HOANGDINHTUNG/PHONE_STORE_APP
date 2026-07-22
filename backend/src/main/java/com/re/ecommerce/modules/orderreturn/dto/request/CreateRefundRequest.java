package com.re.ecommerce.modules.orderreturn.dto.request;

import com.re.ecommerce.modules.orderreturn.enumeration.RefundMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateRefundRequest {

    @NotNull(message = "Payment ID is required")
    private Long paymentId;

    private Long returnRequestId;
    private Long paymentAttemptId;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @NotNull(message = "Refund method is required")
    private RefundMethod method;

    @NotNull(message = "Reason is required")
    private String reason;
}
