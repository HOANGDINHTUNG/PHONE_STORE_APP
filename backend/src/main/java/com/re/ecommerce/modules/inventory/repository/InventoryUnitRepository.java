package com.re.ecommerce.modules.inventory.repository;

import com.re.ecommerce.modules.inventory.entity.InventoryUnit;
import com.re.ecommerce.modules.inventory.entity.enums.InventoryUnitStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InventoryUnitRepository extends JpaRepository<InventoryUnit, Long> {
    
    List<InventoryUnit> findByProductVariantIdAndWarehouseIdAndUnitStatus(UUID productVariantId, UUID warehouseId, InventoryUnitStatus status);
    
    List<InventoryUnit> findBySoldOrderItemId(UUID soldOrderItemId);
}
