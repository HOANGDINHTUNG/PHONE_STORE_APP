package com.re.ecommerce.modules.staff.dto.response;

import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class PermissionResponse {
    private UUID id;
    private String code;
    private String module;
    private String description;
    private OrganizationStatus status;
}
