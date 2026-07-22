package com.re.ecommerce.modules.order.repository;

import com.re.ecommerce.modules.order.entity.CouponUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CouponUsageRepository extends JpaRepository<CouponUsage, UUID> {
    Optional<CouponUsage> findByOrderId(UUID orderId);
}
