package com.re.ecommerce.modules.catalog.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RelatedProductId implements Serializable {
    @Column(name = "source_product_id")
    private UUID sourceProductId;
    @Column(name = "target_product_id")
    private UUID targetProductId;
}
