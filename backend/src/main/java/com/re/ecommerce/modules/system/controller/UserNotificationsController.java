package com.re.ecommerce.modules.system.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.UUID;

@Tag(name = "18. User Notifications")
@RestController
@RequestMapping("/api/v1/me/notifications")
@RequiredArgsConstructor
@Slf4j
public class UserNotificationsController {

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getMyNotifications() {
        return ResponseEntity.ok(Collections.emptyMap());
    }

    @PatchMapping("/read-all")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> markAllAsRead() {
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{notificationId}/read")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> markAsRead(@PathVariable UUID notificationId) {
        return ResponseEntity.ok().build();
    }
}
