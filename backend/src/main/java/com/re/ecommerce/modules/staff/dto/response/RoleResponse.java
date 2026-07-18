package com.re.ecommerce.modules.staff.dto.response;

import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import lombok.Builder;
import lombok.Data;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
public class RoleResponse {
    private UUID id;
    private String code;
    private String name;
    private String description;
    private String roleType;
    private OrganizationStatus status;
    private Set<PermissionResponse> permissions;
}
