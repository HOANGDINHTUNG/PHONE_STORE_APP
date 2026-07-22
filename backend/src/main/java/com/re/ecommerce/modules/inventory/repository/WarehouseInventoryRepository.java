package com.re.ecommerce.modules.inventory.repository;

import com.re.ecommerce.modules.inventory.entity.WarehouseInventory;
import com.re.ecommerce.modules.inventory.entity.WarehouseInventoryId;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WarehouseInventoryRepository extends JpaRepository<WarehouseInventory, WarehouseInventoryId> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT wi FROM WarehouseInventory wi WHERE wi.id = :id")
    Optional<WarehouseInventory> findByIdWithLock(@Param("id") WarehouseInventoryId id);

    List<WarehouseInventory> findByIdWarehouseId(UUID warehouseId);

    List<WarehouseInventory> findByIdProductVariantId(UUID productVariantId);
}
