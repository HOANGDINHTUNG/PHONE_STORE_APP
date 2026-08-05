package com.re.ecommerce.modules.system.repository;

import com.re.ecommerce.modules.system.entity.NotificationDelivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NotificationDeliveryRepository extends JpaRepository<NotificationDelivery, UUID> {
}
