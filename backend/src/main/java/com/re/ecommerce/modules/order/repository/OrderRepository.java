package com.re.ecommerce.modules.order.repository;

import com.re.ecommerce.modules.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    Optional<Order> findByOrderCode(String orderCode);
    Optional<Order> findByIdempotencyKeyHash(byte[] idempotencyKeyHash);
    org.springframework.data.domain.Page<Order> findByCustomer_Id(UUID customerId, org.springframework.data.domain.Pageable pageable);
    Optional<Order> findByCustomer_IdAndOrderCode(UUID customerId, String orderCode);
}
