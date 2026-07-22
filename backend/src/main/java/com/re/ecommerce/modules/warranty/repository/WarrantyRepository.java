package com.re.ecommerce.modules.warranty.repository;

import com.re.ecommerce.modules.warranty.entity.Warranty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WarrantyRepository extends JpaRepository<Warranty, Long> {
    Optional<Warranty> findByWarrantyCode(String warrantyCode);
}
