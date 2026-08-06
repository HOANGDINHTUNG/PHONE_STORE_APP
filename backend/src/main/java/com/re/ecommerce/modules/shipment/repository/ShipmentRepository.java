package com.re.ecommerce.modules.shipment.repository;

import com.re.ecommerce.modules.shipment.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
import java.util.UUID;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    Optional<Shipment> findByShipmentCode(String shipmentCode);

    List<Shipment> findByOrder_IdIn(List<UUID> orderIds);
}
