package com.re.ecommerce.modules.staff.dto.response;

import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class DepartmentResponse {
    private UUID id;
    private String code;
    private String name;
    private OrganizationStatus status;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;
}
