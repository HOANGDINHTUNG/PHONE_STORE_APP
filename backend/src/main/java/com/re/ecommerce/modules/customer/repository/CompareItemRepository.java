package com.re.ecommerce.modules.customer.repository;

import com.re.ecommerce.modules.customer.entity.CompareItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompareItemRepository extends JpaRepository<CompareItem, UUID> {
    List<CompareItem> findByCustomer_IdOrderBySortOrderAscCreatedAtDesc(UUID customerId);
    Optional<CompareItem> findByCustomer_IdAndProductId(UUID customerId, UUID productId);
    long countByCustomer_Id(UUID customerId);
    void deleteByCustomer_IdAndProductId(UUID customerId, UUID productId);
    void deleteByCustomer_Id(UUID customerId);
}
