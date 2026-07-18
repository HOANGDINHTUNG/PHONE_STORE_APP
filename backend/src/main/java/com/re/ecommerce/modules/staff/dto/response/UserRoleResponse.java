package com.re.ecommerce.modules.staff.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class UserRoleResponse {
    private UUID id;
    private UUID userId;
    private RoleSummary role;
    private String status;
    private Instant expiresAt;
    private Instant revokedAt;
    private Instant assignedAt;
    private String assignedBy;
    private String revokedBy;
    private String revokedReason;

    @Data
    @Builder
    public static class RoleSummary {
        private UUID id;
        private String code;
        private String name;
    }
}
