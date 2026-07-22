package com.re.ecommerce.modules.catalog.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record AttributeRequest(
        @NotNull
        List<@Valid AttrItem> items
) {
    public record AttrItem(
            @NotBlank(message = "Attribute name is required") String attributeName,
            @NotBlank(message = "Attribute value is required") String attributeValue
    ) {}
}
