package com.re.ecommerce.modules.staff.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.re.ecommerce.modules.staff.dto.request.UserRoleRequest;
import com.re.ecommerce.modules.staff.dto.response.UserRoleResponse;
import com.re.ecommerce.modules.staff.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "3. Organization Management")
@RestController
@RequestMapping("/api/v1/admin/users/{userId}/role-assignments")
@RequiredArgsConstructor
@Slf4j
public class RoleAssignmentController {

    private final RoleService roleService;

    // ASSIGN-001
    @GetMapping
    @PreAuthorize("hasAuthority('ASSIGN_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<List<UserRoleResponse>> listAssignments(
            @PathVariable UUID userId) {

        return ResponseEntity.ok(roleService.listAssignments(userId));
    }

    // ASSIGN-002
    @PostMapping
    @PreAuthorize("hasAuthority('ASSIGN_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<UserRoleResponse> assignRole(
            @PathVariable UUID userId,
            @Valid @RequestBody UserRoleRequest request,
            Authentication auth) {
        
        String assignedBy = auth != null ? auth.getName() : "SYSTEM";

        UserRoleResponse response = roleService.assignRole(userId, request, assignedBy);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ASSIGN-003
    @PostMapping("/{assignmentId}/revoke")
    @PreAuthorize("hasAuthority('ASSIGN_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<UserRoleResponse> revokeAssignment(
            @PathVariable UUID userId,
            @PathVariable UUID assignmentId,
            @RequestParam(required = false) String reason,
            Authentication auth) {
            
        String revokedBy = auth != null ? auth.getName() : "SYSTEM";
        log.warn("CRITICAL: Agent '{}' forcefully severing UID assignment UID map ID: {}. Reason: {}", revokedBy, assignmentId, reason);
        return ResponseEntity.ok(roleService.revokeAssignment(userId, assignmentId, revokedBy, reason));
    }
}
