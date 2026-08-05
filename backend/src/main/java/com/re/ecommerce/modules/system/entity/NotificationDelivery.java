package com.re.ecommerce.modules.system.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notification_deliveries")
@Getter
@Setter
@NoArgsConstructor
public class NotificationDelivery {
    @Id
    @UuidGenerator
    @Column(columnDefinition = "BINARY(16)", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "notification_id", nullable = false)
    private Notification notification;

    @Column(nullable = false, length = 50)
    private String channel;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(nullable = false, length = 255)
    private String destination;

    @Column(name = "attempt_count", nullable = false)
    private int attemptCount;

    @Column(name = "last_attempt_at")
    private LocalDateTime lastAttemptAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public NotificationDelivery(Notification notification, String destination) {
        this.notification = notification;
        this.channel = "IN_APP";
        this.status = "SENT";
        this.destination = destination;
        this.attemptCount = 1;
        this.lastAttemptAt = LocalDateTime.now();
    }
}
