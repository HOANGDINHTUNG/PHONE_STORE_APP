package com.re.ecommerce.modules.inventory.repository;

import com.re.ecommerce.modules.inventory.entity.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {

    List<StockTransaction> findByWarehouseIdAndProductVariantId(UUID warehouseId, UUID productVariantId);
}
