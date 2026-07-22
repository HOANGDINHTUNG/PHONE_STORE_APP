package com.re.ecommerce.modules.shipment.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateShipmentTrackingRequest {

    @NotBlank
    private String shippingProvider;
    
    @NotBlank
    private String trackingCode;
}
