package com.re.ecommerce.modules.system.repository;

import com.re.ecommerce.modules.system.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findAllByOrderByCreatedAtDesc();
    List<Notification> findByUserUsernameOrderByCreatedAtDesc(String username);
    Optional<Notification> findByIdAndUserUsername(UUID id, String username);
}
