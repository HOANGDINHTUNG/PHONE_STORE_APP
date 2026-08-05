package com.re.ecommerce.modules.inventory.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record InventoryEntityResponse(Long id, UUID warehouseId, UUID variantId, String productName,
                                      String brandName, String variantName, String sku, String imageUrl,
                                      String warehouseName, String unitStatus, String maskedIdentifier,
                                      List<String> identifierTypes, LocalDateTime receivedAt, LocalDateTime soldAt) {}
