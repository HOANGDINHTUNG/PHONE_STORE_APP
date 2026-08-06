package com.re.ecommerce.modules.shipment.service;

import java.util.UUID;

import com.re.ecommerce.modules.shipment.dto.request.AssignShipmentUnitsRequest;
import com.re.ecommerce.modules.shipment.dto.request.ChangeShipmentStatusRequest;
import com.re.ecommerce.modules.shipment.dto.request.CreateShipmentRequest;
import com.re.ecommerce.modules.shipment.dto.request.UpdateShipmentTrackingRequest;
import com.re.ecommerce.modules.shipment.dto.response.ShipmentWarehouseRecommendationResponse;

import java.util.List;

public interface ShipmentService {
    List<ShipmentWarehouseRecommendationResponse> recommendWarehouses(UUID orderId);
    com.re.ecommerce.modules.shipment.entity.Shipment createShipment(UUID orderId, CreateShipmentRequest request, java.util.UUID staffId);
    void assignUnits(Long shipmentId, AssignShipmentUnitsRequest request);
    void updateTracking(Long shipmentId, UpdateShipmentTrackingRequest request);
    void changeStatus(Long shipmentId, ChangeShipmentStatusRequest request);
}
