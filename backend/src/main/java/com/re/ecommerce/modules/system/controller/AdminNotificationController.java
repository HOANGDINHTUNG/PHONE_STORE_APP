package com.re.ecommerce.modules.system.controller;

import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.system.entity.Notification;
import com.re.ecommerce.modules.system.entity.NotificationDelivery;
import com.re.ecommerce.modules.system.repository.NotificationDeliveryRepository;
import com.re.ecommerce.modules.system.repository.NotificationRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/notifications")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('NOTIFICATION_VIEW', 'NOTIFICATION_RETRY') or hasRole('ADMIN')")
public class AdminNotificationController {

    private final NotificationRepository notificationRepository;
    private final NotificationDeliveryRepository deliveryRepository;
    private final UserRepository userRepository;

    public record NotificationRequest(
            UUID userId,
            @NotBlank String title,
            @NotBlank String content,
            String notificationType,
            String entityType,
            String entityId,
            String actionUrl
    ) {}

    public record BroadcastRequest(
            List<UUID> userIds,
            @NotBlank String title,
            @NotBlank String content,
            String notificationType,
            String entityType,
            String entityId,
            String actionUrl
    ) {}

    public record NotificationResponse(
            UUID id,
            UUID userId,
            String userName,
            String userCode,
            String notificationType,
            String title,
            String content,
            String entityType,
            String entityId,
            String actionUrl,
            LocalDateTime createdAt,
            LocalDateTime readAt
    ) {}

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<NotificationResponse>> list() {
        return ResponseEntity.ok(notificationRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('NOTIFICATION_RETRY') or hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<NotificationResponse> create(@Valid @RequestBody NotificationRequest request) {
        if (request.userId() == null) {
            throw new IllegalArgumentException("userId is required. Use /broadcast to notify multiple users.");
        }
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND", "Không tìm thấy người nhận."));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saveNotification(user, request)));
    }

    @PostMapping("/broadcast")
    @PreAuthorize("hasAuthority('NOTIFICATION_RETRY') or hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<List<NotificationResponse>> broadcast(@Valid @RequestBody BroadcastRequest request) {
        List<User> recipients = request.userIds() == null || request.userIds().isEmpty()
                ? userRepository.findAll()
                : userRepository.findAllById(request.userIds());
        if (recipients.isEmpty()) {
            throw new IllegalArgumentException("Không có người nhận hợp lệ.");
        }
        NotificationRequest notification = new NotificationRequest(null, request.title(), request.content(),
                request.notificationType(), request.entityType(), request.entityId(), request.actionUrl());
        return ResponseEntity.status(HttpStatus.CREATED).body(recipients.stream()
                .map(user -> toResponse(saveNotification(user, notification)))
                .toList());
    }

    private Notification saveNotification(User user, NotificationRequest request) {
        Notification notification = notificationRepository.save(new Notification(
                user, request.title().trim(), request.content().trim(),
                normalizeType(request.notificationType()), trimToNull(request.entityType()),
                trimToNull(request.entityId()), trimToNull(request.actionUrl())
        ));
        deliveryRepository.save(new NotificationDelivery(notification, user.getEmail()));
        return notification;
    }

    private NotificationResponse toResponse(Notification notification) {
        User user = notification.getUser();
        return new NotificationResponse(notification.getId(), user.getId(), user.getUsername(), user.getUsername(),
                notification.getNotificationType(), notification.getTitle(), notification.getContent(),
                notification.getEntityType(), notification.getEntityId(), notification.getActionUrl(),
                notification.getCreatedAt(), notification.getReadAt());
    }

    private String normalizeType(String type) {
        if ("Marketing".equalsIgnoreCase(type)) return "Marketing";
        if ("System".equalsIgnoreCase(type)) return "System";
        return "Transactional";
    }

    private String trimToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
