package com.re.ecommerce.modules.catalog.dto.response;

import java.util.UUID;

public record SpecificationResponse(
        UUID id,
        String groupName,
        String specName,
        String specValue,
        int sortOrder
) {}
