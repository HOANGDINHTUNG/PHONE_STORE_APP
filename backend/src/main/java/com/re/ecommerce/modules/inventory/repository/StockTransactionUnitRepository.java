package com.re.ecommerce.modules.inventory.repository;

import com.re.ecommerce.modules.inventory.entity.StockTransactionUnit;
import com.re.ecommerce.modules.inventory.entity.StockTransactionUnitId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StockTransactionUnitRepository extends JpaRepository<StockTransactionUnit, StockTransactionUnitId> {
    @Query("SELECT link FROM StockTransactionUnit link WHERE link.inventoryUnit.id = :unitId ORDER BY link.stockTransaction.createdAt DESC")
    List<StockTransactionUnit> findByInventoryUnitIdOrderByTransactionCreatedAtDesc(@Param("unitId") Long unitId);
}
