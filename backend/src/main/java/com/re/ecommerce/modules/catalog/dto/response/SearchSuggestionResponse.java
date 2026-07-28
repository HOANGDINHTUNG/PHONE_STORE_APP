package com.re.ecommerce.modules.catalog.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchSuggestionResponse {
    private UUID id;
    private String type; // "PRODUCT", "CATEGORY", "BRAND"
    private String title;
    private String slug;
}
