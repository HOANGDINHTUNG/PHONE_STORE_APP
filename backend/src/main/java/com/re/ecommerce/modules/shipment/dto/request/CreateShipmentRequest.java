package com.re.ecommerce.modules.shipment.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateShipmentRequest {

    @NotNull
    private java.util.UUID warehouseId;

    @NotEmpty
    private List<ShipmentItemRequest> items;

    private String shippingProvider;
    private String trackingCode;
    private BigDecimal shippingFee;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShipmentItemRequest {
        @NotNull
        private java.util.UUID orderItemId;

        @NotNull
        private Integer quantity;
    }
}
