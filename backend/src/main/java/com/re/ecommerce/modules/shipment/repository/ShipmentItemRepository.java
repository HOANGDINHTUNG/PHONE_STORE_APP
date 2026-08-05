package com.re.ecommerce.modules.shipment.repository;

import com.re.ecommerce.modules.shipment.entity.ShipmentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface ShipmentItemRepository extends JpaRepository<ShipmentItem, Long> {
    List<ShipmentItem> findByShipment_Id(Long shipmentId);

    @Query("select coalesce(sum(item.quantity), 0) from ShipmentItem item where item.orderItem.id = :orderItemId")
    Long totalShippedQuantityByOrderItemId(@Param("orderItemId") UUID orderItemId);
}
