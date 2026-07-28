package com.re.ecommerce.modules.catalog.dto.response;

import com.re.ecommerce.modules.catalog.entity.PublicationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RelatedProductAdminResponse {
    private UUID targetProductId;
    private String targetProductName;
    private PublicationStatus status;
    private Integer sortOrder;
    private String warning;
}
