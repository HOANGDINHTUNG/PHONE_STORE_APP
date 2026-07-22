package com.re.ecommerce.modules.payment.repository;

import com.re.ecommerce.modules.payment.entity.PaymentAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentAttemptRepository extends JpaRepository<PaymentAttempt, Long> {
    Optional<PaymentAttempt> findByMerchantRequestId(String merchantRequestId);
}
