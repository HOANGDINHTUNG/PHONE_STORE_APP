package com.re.ecommerce.modules.catalog.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record SpecificationRequest(
        @NotNull
        List<@Valid SpecItem> items
) {
    public record SpecItem(
            @NotNull(message = "Group name is required") String groupName,
            @NotNull(message = "Spec name is required") String specName,
            @NotNull(message = "Spec value is required") String specValue,
            int sortOrder
    ) {}
}
