package com.re.ecommerce.modules.staff.controller;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.modules.staff.dto.request.RoleRequest;
import com.re.ecommerce.modules.staff.dto.response.PermissionResponse;
import com.re.ecommerce.modules.staff.dto.response.RoleResponse;
import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import com.re.ecommerce.modules.staff.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class RoleController {
    
    private final RoleService roleService;

    // PERM-001
    @GetMapping("/permissions")
    @PreAuthorize("hasAuthority('ROLE_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<PagedResponse<PermissionResponse>> listPermissions(
            @RequestParam(required = false) String module,
            @RequestParam(required = false) OrganizationStatus status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "100") int size) {
        return ResponseEntity.ok(roleService.listPermissions(module, status, page, size));
    }

    // ROLE-001
    @GetMapping("/roles")
    @PreAuthorize("hasAuthority('ROLE_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<PagedResponse<RoleResponse>> listRoles(
            @RequestParam(required = false) String roleType,
            @RequestParam(required = false) OrganizationStatus status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(roleService.listRoles(roleType, status, keyword, page, size));
    }

    // ROLE-002
    @PostMapping("/roles")
    @PreAuthorize("hasAuthority('ROLE_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<RoleResponse> createRole(@Valid @RequestBody RoleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roleService.createRole(request));
    }

    // ROLE-003
    @GetMapping("/roles/{roleId}")
    @PreAuthorize("hasAuthority('ROLE_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<RoleResponse> getRoleDetail(@PathVariable UUID roleId) {
        return ResponseEntity.ok(roleService.getRoleDetail(roleId));
    }

    // ROLE-004
    @PatchMapping("/roles/{roleId}")
    @PreAuthorize("hasAuthority('ROLE_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<RoleResponse> updateRole(
            @PathVariable UUID roleId,
            @Valid @RequestBody RoleRequest request) {
        return ResponseEntity.ok(roleService.updateRole(roleId, request));
    }

    // ROLE-005
    @PatchMapping("/roles/{roleId}/status")
    @PreAuthorize("hasAuthority('ROLE_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<RoleResponse> changeRoleStatus(
            @PathVariable UUID roleId,
            @RequestParam OrganizationStatus status) {
        return ResponseEntity.ok(roleService.changeRoleStatus(roleId, status));
    }

    // ROLE-006
    @PutMapping("/roles/{roleId}/permissions")
    @PreAuthorize("hasAuthority('ROLE_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<RoleResponse> replacePermissions(
            @PathVariable UUID roleId,
            @RequestBody Set<UUID> permissionIds) {
        return ResponseEntity.ok(roleService.replacePermissions(roleId, permissionIds));
    }
}
