package com.re.ecommerce.modules.isolated;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderShipmentController {

    @GetMapping("/{orderId}/shipments")
    public ResponseEntity<?> getOrderShipments(@PathVariable String orderId) { return ResponseEntity.ok(Collections.emptyList()); }

}
