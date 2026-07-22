package com.re.ecommerce.modules.warranty.dto.request;

import com.re.ecommerce.modules.warranty.enumeration.WarrantyClaimStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeClaimStatusRequest {
    @NotNull(message = "Target status is required")
    private WarrantyClaimStatus status;
    private String resolution;
    private String rejectionReason;
}
