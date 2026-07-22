package com.re.ecommerce.modules.catalog.dto.response;

import java.util.UUID;

public record AttributeResponse(
        UUID id,
        String attributeName,
        String attributeValue
) {}
