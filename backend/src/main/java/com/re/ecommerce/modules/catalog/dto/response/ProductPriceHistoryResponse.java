package com.re.ecommerce.modules.catalog.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductPriceHistoryResponse {
    private BigDecimal oldListPrice;
    private BigDecimal newListPrice;
    private BigDecimal oldSalePrice;
    private BigDecimal newSalePrice;
    private String reason;
    private String changedBy;
    private LocalDateTime effectiveAt;
}
