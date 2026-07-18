package com.re.ecommerce.modules.staff.dto.response;

import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class PositionResponse {
    private UUID id;
    private DepartmentSummary department;
    private String code;
    private String name;
    private OrganizationStatus status;
    private Instant createdAt;
    private Instant updatedAt;
    
    @Data
    @Builder
    public static class DepartmentSummary {
        private UUID id;
        private String code;
        private String name;
    }
}
