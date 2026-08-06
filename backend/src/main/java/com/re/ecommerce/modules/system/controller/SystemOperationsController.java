package com.re.ecommerce.modules.system.controller;

import com.re.ecommerce.common.audit.entity.AuditLog;
import com.re.ecommerce.common.audit.repository.AuditLogRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Tag(name = "17. System & Operations")
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class SystemOperationsController {

    private final AuditLogRepository auditLogRepository;

    private record AuditLogResponse(
            UUID id, LocalDateTime timestamp, String actorEmail, String actionCode,
            String entityType, String result, String correlationId, String ipAddress,
            String userAgent, String oldDataJson, String newDataJson) {}

    private record AdminNotificationResponse(
            UUID id, String notificationType, String title, String content,
            String entityId, LocalDateTime createdAt, LocalDateTime readAt) {}

    // --- Audit Logs ---
    @GetMapping("/admin/audit-logs")
    @PreAuthorize("hasAuthority('AUDIT_VIEW') or hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<AuditLogResponse>> getAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findAll().stream()
                .sorted(Comparator.comparing(AuditLog::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toAuditResponse)
                .toList());
    }

    @GetMapping("/admin/audit-logs/{logId}")
    @PreAuthorize("hasAuthority('AUDIT_VIEW') or hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<AuditLogResponse> getAuditLog(@PathVariable UUID logId) {
        AuditLog auditLog = auditLogRepository.findById(logId).orElseThrow();
        return ResponseEntity.ok(toAuditResponse(auditLog));
    }

    @PostMapping("/admin/audit-logs/export")
    @PreAuthorize("hasAuthority('AUDIT_VIEW') or hasRole('ADMIN')")
    public ResponseEntity<?> exportAuditLogs() {
        return ResponseEntity.ok("file-link");
    }

    // --- Background Jobs ---
    @GetMapping("/admin/jobs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getJobs() {
        return ResponseEntity.ok(Collections.emptyMap());
    }

    @PostMapping("/admin/jobs/{jobId}/run")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> runJob(@PathVariable UUID jobId) {
        return ResponseEntity.ok().build();
    }

    // --- Admin Notifications ---
    @GetMapping("/admin/notifications/legacy-audit")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<AdminNotificationResponse>> getAdminNotifications() {
        return ResponseEntity.ok(auditLogRepository.findAll().stream()
                .sorted(Comparator.comparing(AuditLog::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(100)
                .map(audit -> new AdminNotificationResponse(
                        audit.getId(),
                        "System",
                        "Hoạt động hệ thống: " + audit.getActionCode(),
                        "Tác nhân " + (audit.getActorUsername() == null ? "hệ thống" : audit.getActorUsername())
                                + " đã cập nhật " + audit.getEntityType(),
                        audit.getEntityId(), audit.getCreatedAt(), null))
                .toList());
    }

    @PostMapping("/admin/notifications/legacy")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createNotification(@RequestBody Object notification) {
        return ResponseEntity.status(201).body(Collections.emptyMap());
    }

    @PostMapping("/admin/notifications/legacy/broadcast")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> broadcastNotification(@RequestBody Object notification) {
        return ResponseEntity.ok().build();
    }

    // --- Outbox ---
    @GetMapping("/admin/outbox")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getOutbox() {
        return ResponseEntity.ok(Collections.emptyMap());
    }

    @PostMapping("/admin/outbox/{eventId}/retry")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> retryOutboxEvent(@PathVariable UUID eventId) {
        return ResponseEntity.ok().build();
    }

    // --- Reports ---
    @GetMapping("/admin/reports/inventory")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getInventoryReport() {
        return ResponseEntity.ok(Collections.emptyMap());
    }

    @GetMapping("/admin/reports/sales")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getSalesReport() {
        return ResponseEntity.ok(Collections.emptyMap());
    }

    // --- Webhooks Logs ---
    @GetMapping("/webhooks/logs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getWebhookLogs() {
        return ResponseEntity.ok(Collections.emptyMap());
    }

    @PostMapping("/webhooks/logs/{logId}/retry")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> retryWebhook(@PathVariable UUID logId) {
        return ResponseEntity.ok().build();
    }

    private AuditLogResponse toAuditResponse(AuditLog auditLog) {
        return new AuditLogResponse(auditLog.getId(), auditLog.getCreatedAt(), auditLog.getActorUsername(),
                auditLog.getActionCode(), auditLog.getEntityType(), auditLog.getResult(),
                auditLog.getCorrelationId(), auditLog.getIpAddress(), auditLog.getUserAgent(),
                auditLog.getOldData(), auditLog.getNewData());
    }
}
