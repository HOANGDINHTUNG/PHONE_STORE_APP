package com.re.ecommerce.modules.catalog.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RelatedProductReplaceRequest {
    @NotNull
    @Valid
    private List<RelatedProductItemRequest> relatedProducts;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RelatedProductItemRequest {
        @NotNull
        private UUID targetProductId;
        @NotNull
        private Integer sortOrder;
    }
}
