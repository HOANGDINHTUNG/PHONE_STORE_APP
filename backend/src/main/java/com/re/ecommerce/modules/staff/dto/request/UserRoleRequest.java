package com.re.ecommerce.modules.staff.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
public class UserRoleRequest {
    @NotNull(message = "ID của role không được trống")
    private UUID roleId;

    private Instant expiresAt;

    private String reason;
}
