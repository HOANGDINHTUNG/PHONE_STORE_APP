package com.re.ecommerce.modules.inventory.repository;

import com.re.ecommerce.modules.inventory.entity.Supplier;
import com.re.ecommerce.modules.inventory.entity.enums.SupplierStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, UUID> {
    Optional<Supplier> findBySupplierCode(String supplierCode);
    Optional<Supplier> findByName(String name);
    Optional<Supplier> findByTaxCode(String taxCode);
    Page<Supplier> findByStatus(SupplierStatus status, Pageable pageable);
}
