package com.re.ecommerce.modules.shipment.entity;

import com.re.ecommerce.modules.inventory.entity.InventoryUnit;
import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@Entity
@Table(name = "shipment_item_units")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentItemUnit {

    @EmbeddedId
    private ShipmentItemUnitId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("shipmentItemId")
    @JoinColumn(name = "shipment_item_id", nullable = false)
    private ShipmentItem shipmentItem;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("inventoryUnitId")
    @JoinColumn(name = "inventory_unit_id", nullable = false, unique = true)
    private InventoryUnit inventoryUnit;

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class ShipmentItemUnitId implements Serializable {
        private Long shipmentItemId;
        private Long inventoryUnitId;
    }
}
