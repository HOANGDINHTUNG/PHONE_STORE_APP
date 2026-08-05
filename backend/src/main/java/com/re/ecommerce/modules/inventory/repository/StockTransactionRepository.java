package com.re.ecommerce.modules.inventory.repository;

import com.re.ecommerce.modules.inventory.entity.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {

    List<StockTransaction> findByWarehouseIdAndProductVariantId(UUID warehouseId, UUID productVariantId);

    List<StockTransaction> findByInventoryUnitIdOrderByCreatedAtDesc(Long inventoryUnitId);

    @Query("""
            SELECT transaction FROM StockTransaction transaction
            WHERE (:warehouseId IS NULL OR transaction.warehouse.id = :warehouseId)
              AND (:transactionType IS NULL OR transaction.transactionType = :transactionType)
              AND (:keyword IS NULL OR LOWER(transaction.productVariant.sku) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(transaction.productVariant.product.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(COALESCE(transaction.createdBy, '')) LIKE LOWER(CONCAT('%', :keyword, '%')))
            """)
    Page<StockTransaction> searchLedger(@Param("warehouseId") UUID warehouseId,
                                        @Param("transactionType") com.re.ecommerce.modules.inventory.entity.enums.StockTransactionType transactionType,
                                        @Param("keyword") String keyword,
                                        Pageable pageable);
}
