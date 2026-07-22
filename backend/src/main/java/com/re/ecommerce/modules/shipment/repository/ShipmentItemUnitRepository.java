package com.re.ecommerce.modules.shipment.repository;

import com.re.ecommerce.modules.shipment.entity.ShipmentItemUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentItemUnitRepository extends JpaRepository<ShipmentItemUnit, ShipmentItemUnit.ShipmentItemUnitId> {
    List<ShipmentItemUnit> findByShipmentItem_Id(Long shipmentItemId);
    Optional<ShipmentItemUnit> findByInventoryUnit_Id(Long inventoryUnitId);
}
