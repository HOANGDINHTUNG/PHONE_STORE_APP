package com.re.ecommerce.modules.auth.repository;

import com.re.ecommerce.modules.auth.entity.CustomerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, UUID> {
    Optional<CustomerProfile> findByCustomerCode(String customerCode);
    Optional<CustomerProfile> findByUserUsername(String username);
}
