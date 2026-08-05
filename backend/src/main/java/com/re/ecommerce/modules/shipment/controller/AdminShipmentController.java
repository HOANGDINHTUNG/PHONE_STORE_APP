package com.re.ecommerce.modules.shipment.controller;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.inventory.dto.response.WarehouseResponse;
import com.re.ecommerce.modules.inventory.entity.Warehouse;
import com.re.ecommerce.modules.inventory.repository.WarehouseRepository;
import com.re.ecommerce.modules.shipment.dto.request.ChangeShipmentStatusRequest;
import com.re.ecommerce.modules.shipment.dto.request.CreateShipmentRequest;
import com.re.ecommerce.modules.shipment.dto.request.UpdateShipmentTrackingRequest;
import com.re.ecommerce.modules.shipment.dto.response.AdminShipmentDetailResponse;
import com.re.ecommerce.modules.shipment.dto.response.AdminShipmentItemResponse;
import com.re.ecommerce.modules.shipment.dto.response.AdminShipmentResponse;
import com.re.ecommerce.modules.shipment.entity.Shipment;
import com.re.ecommerce.modules.shipment.entity.ShipmentItem;
import com.re.ecommerce.modules.shipment.repository.ShipmentItemRepository;
import com.re.ecommerce.modules.shipment.repository.ShipmentItemUnitRepository;
import com.re.ecommerce.modules.shipment.repository.ShipmentRepository;
import com.re.ecommerce.modules.shipment.service.ShipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/shipments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminShipmentController {
    private final ShipmentRepository shipmentRepository;
    private final ShipmentItemRepository shipmentItemRepository;
    private final ShipmentItemUnitRepository shipmentItemUnitRepository;
    private final WarehouseRepository warehouseRepository;
    private final ShipmentService shipmentService;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<PagedResponse<AdminShipmentResponse>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "100") int size) {
        Page<Shipment> shipments = shipmentRepository.findAll(PageRequest.of(Math.max(page - 1, 0), Math.min(Math.max(size, 1), 100), Sort.by("createdAt").descending()));
        return ResponseEntity.ok(PagedResponse.of(shipments, shipments.getContent().stream().map(this::toSummary).toList()));
    }

    @GetMapping("/warehouses")
    @Transactional(readOnly = true)
    public ResponseEntity<List<WarehouseResponse>> warehouses() {
        return ResponseEntity.ok(warehouseRepository.findAll().stream()
                .map(this::toWarehouseResponse).toList());
    }

    @GetMapping("/{shipmentId}")
    @Transactional(readOnly = true)
    public ResponseEntity<AdminShipmentDetailResponse> get(@PathVariable Long shipmentId) {
        return ResponseEntity.ok(toDetail(findShipment(shipmentId)));
    }

    @PostMapping("/orders/{orderId}")
    public ResponseEntity<AdminShipmentDetailResponse> create(
            @PathVariable UUID orderId,
            @Valid @RequestBody CreateShipmentRequest request,
            @AuthenticationPrincipal User currentUser) {
        Shipment shipment = shipmentService.createShipment(orderId, request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(toDetail(shipment));
    }

    @PatchMapping("/{shipmentId}/tracking")
    public ResponseEntity<AdminShipmentDetailResponse> updateTracking(
            @PathVariable Long shipmentId, @Valid @RequestBody UpdateShipmentTrackingRequest request) {
        shipmentService.updateTracking(shipmentId, request);
        return ResponseEntity.ok(toDetail(findShipment(shipmentId)));
    }

    @PatchMapping("/{shipmentId}/status")
    public ResponseEntity<AdminShipmentDetailResponse> updateStatus(
            @PathVariable Long shipmentId, @Valid @RequestBody ChangeShipmentStatusRequest request) {
        shipmentService.changeStatus(shipmentId, request);
        return ResponseEntity.ok(toDetail(findShipment(shipmentId)));
    }

    private Shipment findShipment(Long id) {
        return shipmentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("SHIPMENT_NOT_FOUND", "Shipment not found"));
    }

    private AdminShipmentResponse toSummary(Shipment shipment) {
        return new AdminShipmentResponse(shipment.getId(), shipment.getShipmentCode(), shipment.getOrder().getId(), shipment.getOrder().getOrderCode(), shipment.getWarehouse().getId(), shipment.getWarehouse().getName(), shipment.getShippingProvider(), shipment.getTrackingCode(), shipmentItemRepository.findByShipment_Id(shipment.getId()).size(), shipment.getShippingFee(), shipment.getStatus().name(), shipment.getEstimatedDeliveryAt(), shipment.getCreatedAt());
    }

    private AdminShipmentDetailResponse toDetail(Shipment shipment) {
        var order = shipment.getOrder();
        String destination = java.util.stream.Stream.of(order.getShippingDetailAddress(), order.getShippingWardName(), order.getShippingDistrictName(), order.getShippingProvinceName())
                .filter(value -> value != null && !value.isBlank())
                .reduce((left, right) -> left + ", " + right)
                .orElse(null);
        List<AdminShipmentItemResponse> items = shipmentItemRepository.findByShipment_Id(shipment.getId()).stream().map(this::toItem).toList();
        return new AdminShipmentDetailResponse(shipment.getId(), shipment.getShipmentCode(), order.getId(), order.getOrderCode(), shipment.getWarehouse().getName(), shipment.getWarehouse().getAddress(), shipment.getShippingProvider(), shipment.getTrackingCode(), shipment.getShippingFee(), shipment.getStatus().name(), shipment.getCreatedAt(), shipment.getEstimatedDeliveryAt(), shipment.getShippedAt(), shipment.getDeliveredAt(), order.getReceiverName(), order.getReceiverPhone(), destination, items);
    }

    private AdminShipmentItemResponse toItem(ShipmentItem item) {
        var orderItem = item.getOrderItem();
        List<String> identifiers = shipmentItemUnitRepository.findByShipmentItem_Id(item.getId()).stream()
                .flatMap(unit -> unit.getInventoryUnit().getIdentifiers().stream())
                .map(identifier -> identifier.getIdentifierValue()).toList();
        return new AdminShipmentItemResponse(item.getId(), orderItem.getId(), orderItem.getProductName(), orderItem.getVariantName(), orderItem.getSku(), orderItem.getImageUrl(), item.getQuantity(), orderItem.getUnitPrice(), identifiers);
    }

    private WarehouseResponse toWarehouseResponse(Warehouse warehouse) {
        return new WarehouseResponse(warehouse.getId(), warehouse.getCode(), warehouse.getName(), warehouse.getPhone(), warehouse.getAddress(), warehouse.getStatus(), warehouse.getCreatedAt(), warehouse.getUpdatedAt());
    }
}
