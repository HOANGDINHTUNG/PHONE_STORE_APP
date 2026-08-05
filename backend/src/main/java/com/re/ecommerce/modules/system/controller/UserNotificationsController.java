package com.re.ecommerce.modules.system.controller;

import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.system.entity.Notification;
import com.re.ecommerce.modules.system.repository.NotificationRepository;
import com.re.ecommerce.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/me/notifications")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class UserNotificationsController {

    private final NotificationRepository notificationRepository;

    public record NotificationResponse(
            UUID id, String notificationType, String title, String content,
            String entityType, String entityId, String actionUrl,
            LocalDateTime createdAt, LocalDateTime readAt
    ) {}

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(notificationRepository.findByUserUsernameOrderByCreatedAtDesc(userDetails.getUsername())
                .stream().map(this::toResponse).toList());
    }

    @PostMapping("/read-all")
    @Transactional
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal CustomUserDetails userDetails) {
        LocalDateTime now = LocalDateTime.now();
        notificationRepository.findByUserUsernameOrderByCreatedAtDesc(userDetails.getUsername()).stream()
                .filter(notification -> notification.getReadAt() == null)
                .forEach(notification -> notification.setReadAt(now));
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{notificationId}/read")
    @Transactional
    public ResponseEntity<Void> markAsRead(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable UUID notificationId) {
        Notification notification = notificationRepository.findByIdAndUserUsername(notificationId, userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("NOTIFICATION_NOT_FOUND", "Không tìm thấy thông báo."));
        if (notification.getReadAt() == null) notification.setReadAt(LocalDateTime.now());
        return ResponseEntity.ok().build();
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(notification.getId(), notification.getNotificationType(), notification.getTitle(),
                notification.getContent(), notification.getEntityType(), notification.getEntityId(), notification.getActionUrl(),
                notification.getCreatedAt(), notification.getReadAt());
    }
}
