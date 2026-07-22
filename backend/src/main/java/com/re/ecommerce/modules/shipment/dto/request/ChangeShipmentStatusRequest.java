package com.re.ecommerce.modules.shipment.dto.request;

import com.re.ecommerce.modules.shipment.entity.ShipmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChangeShipmentStatusRequest {

    @NotNull
    private ShipmentStatus status;
}
