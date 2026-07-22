package com.re.ecommerce.modules.inventory.repository;

import com.re.ecommerce.modules.inventory.entity.PurchaseOrder;
import com.re.ecommerce.modules.inventory.entity.enums.PurchaseOrderStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, UUID> {
    
    Optional<PurchaseOrder> findByPurchaseOrderCode(String code);
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM PurchaseOrder p WHERE p.id = :id")
    Optional<PurchaseOrder> findByIdWithLock(@Param("id") UUID id);
    
    Page<PurchaseOrder> findByStatus(PurchaseOrderStatus status, Pageable pageable);
    
    Page<PurchaseOrder> findBySupplierId(UUID supplierId, Pageable pageable);
    
    Page<PurchaseOrder> findByWarehouseId(UUID warehouseId, Pageable pageable);
}
