package com.re.ecommerce.modules.shipment.repository;

import com.re.ecommerce.modules.shipment.entity.ShipmentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShipmentItemRepository extends JpaRepository<ShipmentItem, Long> {
    List<ShipmentItem> findByShipment_Id(Long shipmentId);
}
