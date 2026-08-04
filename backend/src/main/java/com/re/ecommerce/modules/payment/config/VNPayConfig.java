package com.re.ecommerce.modules.payment.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Getter
@Configuration
public class VNPayConfig {

    @Value("${vnpay.tmn-code:3L2PFTMI}") // default test code
    private String vnpTmnCode;

    @Value("${vnpay.hash-secret:TMDVRYNKYGOGJNSCYXZJMYRDBRITQITJ}") // default test secret
    private String vnpHashSecret;

    @Value("${vnpay.url:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    private String vnpUrl;

    @Value("${vnpay.return-url:http://localhost:5173/payment/vnpay-return}")
    private String vnpReturnUrl;

    @Value("${vnpay.api-url:https://sandbox.vnpayment.vn/merchant_webapi/api/transaction}")
    private String vnpApiUrl;
}
