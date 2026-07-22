package com.re.ecommerce.modules.orderreturn.dto.request;

import com.re.ecommerce.modules.orderreturn.enumeration.ReturnItemResolution;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class InspectReturnRequest {

    @NotEmpty(message = "Item inspections are required")
    private List<ItemInspectionRequest> inspections;

    @Getter
    @Setter
    public static class ItemInspectionRequest {
        @NotNull(message = "Return item ID is required")
        private Long returnItemId;

        @NotNull(message = "Resolution is required")
        private ReturnItemResolution resolution;

        @NotNull(message = "Refund amount is required")
        private BigDecimal refundAmount;

        private String conditionNote;
    }
}
