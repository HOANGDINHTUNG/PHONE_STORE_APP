package com.re.ecommerce.modules.inventory.repository;

import com.re.ecommerce.modules.inventory.entity.Warehouse;
import com.re.ecommerce.modules.inventory.entity.enums.WarehouseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, UUID> {
    Optional<Warehouse> findByCode(String code);
    Optional<Warehouse> findByName(String name);
    Page<Warehouse> findByStatus(WarehouseStatus status, Pageable pageable);
}
