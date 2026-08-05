package com.re.ecommerce.modules.staff.controller;

import com.re.ecommerce.modules.staff.dto.response.UserRoleResponse;
import com.re.ecommerce.modules.staff.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Read model used by the admin console to relate accounts, staff and their roles. */
@RestController
@RequestMapping("/api/v1/admin/role-assignments")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ASSIGN_MANAGE') or hasRole('ADMIN')")
public class AdminRoleAssignmentController {

    private final RoleService roleService;

    @GetMapping
    public ResponseEntity<List<UserRoleResponse>> listAllAssignments() {
        return ResponseEntity.ok(roleService.listAllAssignments());
    }
}
