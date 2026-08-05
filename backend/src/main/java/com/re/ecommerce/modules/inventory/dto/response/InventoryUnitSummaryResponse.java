package com.re.ecommerce.modules.inventory.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record InventoryUnitSummaryResponse(Long id, String unitStatus, List<String> identifiers,
                                           LocalDateTime receivedAt, LocalDateTime soldAt) {}
