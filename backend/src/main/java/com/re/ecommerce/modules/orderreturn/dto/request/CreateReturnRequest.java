package com.re.ecommerce.modules.orderreturn.dto.request;

import com.re.ecommerce.modules.orderreturn.enumeration.ReturnRequestType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class CreateReturnRequest {

    @NotNull(message = "Return type is required")
    private ReturnRequestType type;

    @NotEmpty(message = "Items are required")
    private List<ReturnItemRequest> items;

    @Getter
    @Setter
    public static class ReturnItemRequest {
        @NotNull(message = "Order item ID is required")
        private UUID orderItemId;
        
        @NotNull(message = "Quantity is required")
        private Integer quantity;
        
        @NotNull(message = "Reason is required")
        private String reason;
    }
}
