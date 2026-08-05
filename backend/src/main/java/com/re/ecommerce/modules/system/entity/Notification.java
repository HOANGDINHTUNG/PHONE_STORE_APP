package com.re.ecommerce.modules.system.entity;

import com.re.ecommerce.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_notifications_user_created", columnList = "user_id, created_at")
})
@Getter
@Setter
@NoArgsConstructor
public class Notification {
    @Id
    @UuidGenerator
    @Column(columnDefinition = "BINARY(16)", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "notification_type", nullable = false, length = 50)
    private String notificationType;

    @Column(name = "entity_type", length = 100)
    private String entityType;

    @Column(name = "entity_id", length = 50)
    private String entityId;

    @Column(name = "action_url", length = 500)
    private String actionUrl;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Notification(User user, String title, String content, String notificationType,
                        String entityType, String entityId, String actionUrl) {
        this.user = user;
        this.title = title;
        this.content = content;
        this.notificationType = notificationType;
        this.entityType = entityType;
        this.entityId = entityId;
        this.actionUrl = actionUrl;
    }
}
