package com.re.ecommerce.modules.isolated;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;

@RestController
@RequestMapping("/api/v1/webhooks/shipments")
public class ShipmentWebhookController {

    @PostMapping("/{provider}")
    public ResponseEntity<?> handleWebhook(@PathVariable String provider) { return ResponseEntity.ok(Collections.emptyMap()); }

}
