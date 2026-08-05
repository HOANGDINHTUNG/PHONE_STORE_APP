package com.re.ecommerce.modules.inventory.repository;

import com.re.ecommerce.modules.inventory.entity.InventoryUnit;
import com.re.ecommerce.modules.inventory.entity.enums.InventoryUnitStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface InventoryUnitRepository extends JpaRepository<InventoryUnit, Long> {
    
    List<InventoryUnit> findByProductVariantIdAndWarehouseIdAndUnitStatus(UUID productVariantId, UUID warehouseId, InventoryUnitStatus status);
    
    List<InventoryUnit> findBySoldOrderItemId(UUID soldOrderItemId);

    List<InventoryUnit> findByWarehouseIdAndProductVariantIdOrderByCreatedAtDesc(UUID warehouseId, UUID productVariantId);

    @Query(value = """
            SELECT DISTINCT u FROM InventoryUnit u
            JOIN u.productVariant v JOIN v.product p LEFT JOIN u.identifiers identifier
            WHERE (:warehouseId IS NULL OR u.warehouse.id = :warehouseId)
              AND (:status IS NULL OR u.unitStatus = :status)
              AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(v.sku) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(v.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(identifier.normalizedIdentifier) LIKE LOWER(CONCAT('%', :keyword, '%')))
            """, countQuery = """
            SELECT COUNT(DISTINCT u) FROM InventoryUnit u
            JOIN u.productVariant v JOIN v.product p LEFT JOIN u.identifiers identifier
            WHERE (:warehouseId IS NULL OR u.warehouse.id = :warehouseId)
              AND (:status IS NULL OR u.unitStatus = :status)
              AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(v.sku) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(v.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(identifier.normalizedIdentifier) LIKE LOWER(CONCAT('%', :keyword, '%')))
            """)
    Page<InventoryUnit> searchEntities(@Param("warehouseId") UUID warehouseId,
                                       @Param("status") InventoryUnitStatus status,
                                       @Param("keyword") String keyword,
                                       Pageable pageable);
}
