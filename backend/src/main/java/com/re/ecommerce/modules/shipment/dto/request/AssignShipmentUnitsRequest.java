package com.re.ecommerce.modules.shipment.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class AssignShipmentUnitsRequest {

    @NotEmpty
    private List<UnitAssignmentRequest> assignments;

    @Data
    @NoArgsConstructor
    public static class UnitAssignmentRequest {
        @NotEmpty
        private Long shipmentItemId;
        @NotEmpty
        private List<Long> inventoryUnitIds;
    }
}
