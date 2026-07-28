package com.re.ecommerce.modules.auth.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record SessionResponse(
    UUID sessionId,
    String deviceName,
    String ipAddress,
    LocalDateTime firstSeenAt,
    LocalDateTime lastUsedAt,
    boolean currentSession,
    boolean active,
    LocalDateTime expiresAt
) {}
