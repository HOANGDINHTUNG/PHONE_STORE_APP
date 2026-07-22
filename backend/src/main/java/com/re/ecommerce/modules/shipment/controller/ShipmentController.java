package com.re.ecommerce.modules.shipment.controller;

//
import com.re.ecommerce.modules.shipment.dto.request.AssignShipmentUnitsRequest;
import com.re.ecommerce.modules.shipment.dto.request.ChangeShipmentStatusRequest;
import com.re.ecommerce.modules.shipment.dto.request.CreateShipmentRequest;
import com.re.ecommerce.modules.shipment.dto.request.UpdateShipmentTrackingRequest;
import com.re.ecommerce.modules.shipment.service.ShipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @PostMapping("/orders/{orderId}/shipments")
    public ResponseEntity<Void> createShipment(
            @PathVariable UUID orderId,
            @RequestAttribute("userId") String staffId,
            @Valid @RequestBody CreateShipmentRequest request) {
        
        shipmentService.createShipment(orderId, request, UUID.fromString(staffId));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/shipments/{shipmentId}/units")
    public ResponseEntity<Void> assignUnits(
            @PathVariable Long shipmentId,
            @Valid @RequestBody AssignShipmentUnitsRequest request) {
            
        shipmentService.assignUnits(shipmentId, request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/shipments/{shipmentId}/tracking")
    public ResponseEntity<Void> updateTracking(
            @PathVariable Long shipmentId,
            @Valid @RequestBody UpdateShipmentTrackingRequest request) {
            
        shipmentService.updateTracking(shipmentId, request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/shipments/{shipmentId}/status")
    public ResponseEntity<Void> changeStatus(
            @PathVariable Long shipmentId,
            @Valid @RequestBody ChangeShipmentStatusRequest request) {
            
        shipmentService.changeStatus(shipmentId, request);
        return ResponseEntity.ok().build();
    }
}
