package com.re.ecommerce.modules.payment.dto.request;

import com.re.ecommerce.modules.payment.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentAttemptRequest {

    // merchantRequestId from headers is not generally mapped in the JSON body,
    // we'll pass it to the service manually.

    @NotNull(message = "Payment method is required")
    private PaymentMethod method;

}
