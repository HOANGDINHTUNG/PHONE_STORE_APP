package com.re.ecommerce.modules.payment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentAttemptResponse {
    private String redirectUrl;
    private String attemptId;
    private String method;
}
