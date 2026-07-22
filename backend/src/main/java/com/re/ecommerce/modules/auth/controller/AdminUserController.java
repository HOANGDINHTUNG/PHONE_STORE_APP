package com.re.ecommerce.modules.auth.controller;

import com.re.ecommerce.modules.auth.dto.response.UserResponse;
import com.re.ecommerce.modules.auth.entity.AccountStatus;
import com.re.ecommerce.modules.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@Slf4j
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')") // P0 specs mentions USER_VIEW permission, mapping to role for now
    public ResponseEntity<List<UserResponse>> listUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) AccountStatus status) {
        log.debug("Listing users internally with keyword: {} and status: {}", keyword, status);
        return ResponseEntity.ok(userService.listUsers(keyword, status));
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserResponse> getUser(@PathVariable UUID userId) {
        log.info("Fetching Admin profile detail for userId: {}", userId);
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PatchMapping("/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')") // USER_UPDATE
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable UUID userId,
            @RequestBody com.re.ecommerce.modules.auth.dto.request.UserUpdateAdminRequest request) {
        log.info("Admin manually updating target userId: {}", userId);
        return ResponseEntity.ok(userService.adminUpdateUser(userId, request));
    }

    @PatchMapping("/{userId}/status")
    @PreAuthorize("hasAuthority('ADMIN')") // USER_DISABLE
    public ResponseEntity<UserResponse> changeUserStatus(
            @PathVariable UUID userId,
            @RequestParam AccountStatus status) {
        log.info("Changing account security status of userId {} to {}", userId, status);
        return ResponseEntity.ok(userService.changeUserStatus(userId, status));
    }
}
