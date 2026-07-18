package com.re.ecommerce.modules.staff.entity;

import com.re.ecommerce.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_roles")
@Getter
@Setter
public class UserRole {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(nullable = false, length = 50)
    private String status = "ACTIVE";

    @Column(name = "active_assignment_key", unique = true, length = 100)
    private String activeAssignmentKey;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "revoked_at")
    private Instant revokedAt;

    @CreationTimestamp
    @Column(name = "assigned_at")
    private Instant assignedAt;

    @Column(name = "assigned_by")
    private String assignedBy;

    @Column(name = "revoked_by")
    private String revokedBy;

    @Column(name = "revoked_reason")
    private String revokedReason;
}
