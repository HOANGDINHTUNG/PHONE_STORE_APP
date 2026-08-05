package com.re.ecommerce.modules.auth.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

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

@Tag(name = "4. Admin User Management")
@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@Slf4j
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> listUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) AccountStatus status) {

        return ResponseEntity.ok(userService.listUsers(keyword, status));
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUser(@PathVariable UUID userId) {

        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PatchMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable UUID userId,
            @RequestBody com.re.ecommerce.modules.auth.dto.request.UserUpdateAdminRequest request) {

        return ResponseEntity.ok(userService.adminUpdateUser(userId, request));
    }

    @PatchMapping("/{userId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> changeUserStatus(
            @PathVariable UUID userId,
            @RequestParam AccountStatus status) {

        return ResponseEntity.ok(userService.changeUserStatus(userId, status));
    }
}
