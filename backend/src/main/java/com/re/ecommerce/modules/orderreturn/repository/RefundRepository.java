package com.re.ecommerce.modules.orderreturn.repository;

import com.re.ecommerce.modules.orderreturn.entity.Refund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {
    Optional<Refund> findByRefundCode(String refundCode);
    Optional<Refund> findByIdempotencyKey(String idempotencyKey);
}
