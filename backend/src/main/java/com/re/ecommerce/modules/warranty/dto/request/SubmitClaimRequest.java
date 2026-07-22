package com.re.ecommerce.modules.warranty.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmitClaimRequest {
    @NotBlank(message = "Issue description is required")
    private String issueDescription;
}
