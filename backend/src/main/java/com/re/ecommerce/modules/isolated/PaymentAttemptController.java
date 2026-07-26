package com.re.ecommerce.modules.isolated;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;

@RestController
@RequestMapping("/api/v1/payment-attempts")
public class PaymentAttemptController {

    @GetMapping("/{id}")
    public ResponseEntity<?> getPayment(@PathVariable String id) { return ResponseEntity.ok(Collections.emptyMap()); }

}
