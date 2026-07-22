package com.re.ecommerce.modules.payment.repository;

import com.re.ecommerce.modules.payment.entity.PaymentWebhookEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentWebhookEventRepository extends JpaRepository<PaymentWebhookEvent, Long> {
    Optional<PaymentWebhookEvent> findByProviderCodeAndProviderEventId(String providerCode, String providerEventId);
}
