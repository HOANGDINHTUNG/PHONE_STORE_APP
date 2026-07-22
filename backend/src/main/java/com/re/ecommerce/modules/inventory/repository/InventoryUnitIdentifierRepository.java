package com.re.ecommerce.modules.inventory.repository;

import com.re.ecommerce.modules.inventory.entity.InventoryUnitIdentifier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryUnitIdentifierRepository extends JpaRepository<InventoryUnitIdentifier, Long> {
    Optional<InventoryUnitIdentifier> findByNormalizedIdentifier(String normalizedIdentifier);
}
