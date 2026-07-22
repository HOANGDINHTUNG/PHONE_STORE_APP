package com.re.ecommerce.modules.payment.repository;

import com.re.ecommerce.modules.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrder_Id(java.util.UUID orderId);
    Optional<Payment> findByOrder_OrderCode(String orderCode);
}
