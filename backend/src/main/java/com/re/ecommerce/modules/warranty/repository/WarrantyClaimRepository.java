package com.re.ecommerce.modules.warranty.repository;

import com.re.ecommerce.modules.warranty.entity.WarrantyClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WarrantyClaimRepository extends JpaRepository<WarrantyClaim, Long> {
    Optional<WarrantyClaim> findByClaimCode(String claimCode);
}
