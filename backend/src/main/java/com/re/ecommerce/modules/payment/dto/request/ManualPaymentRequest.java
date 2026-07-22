package com.re.ecommerce.modules.payment.dto.request;

import com.re.ecommerce.modules.payment.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ManualPaymentRequest {

    @NotNull
    private BigDecimal amount;

    @NotNull
    private PaymentMethod method;

    private String referenceNote;
}
