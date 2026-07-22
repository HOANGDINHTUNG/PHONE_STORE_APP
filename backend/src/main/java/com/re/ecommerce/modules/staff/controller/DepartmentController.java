package com.re.ecommerce.modules.staff.controller;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.modules.staff.dto.request.DepartmentRequest;
import com.re.ecommerce.modules.staff.dto.response.DepartmentResponse;
import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import com.re.ecommerce.modules.staff.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/departments")
@RequiredArgsConstructor
@Slf4j
public class DepartmentController {
    
    private final DepartmentService departmentService;

    @GetMapping
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<PagedResponse<DepartmentResponse>> listDepartments(
            @RequestParam(required = false) OrganizationStatus status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.debug("Department lists fetched with mapping param Keyword={} Status={} Page={}", keyword, status, page);
        return ResponseEntity.ok(departmentService.listDepartments(status, keyword, page, size));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('DEPARTMENT_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<DepartmentResponse> createDepartment(@Valid @RequestBody DepartmentRequest request) {
        log.info("Forming new Internal operation department constraint layer");
        DepartmentResponse response = departmentService.createDepartment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{departmentId}")
    @PreAuthorize("hasAuthority('DEPARTMENT_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<DepartmentResponse> updateDepartment(
            @PathVariable UUID departmentId,
            @Valid @RequestBody DepartmentRequest request) {
        log.info("Manually resetting structural definitions of dept unit {}", departmentId);
        return ResponseEntity.ok(departmentService.updateDepartment(departmentId, request));
    }

    @PatchMapping("/{departmentId}/status")
    @PreAuthorize("hasAuthority('DEPARTMENT_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<DepartmentResponse> changeDepartmentStatus(
            @PathVariable UUID departmentId,
            @RequestParam OrganizationStatus status) {
        log.info("Overwriting specific status variables binding Department {}; Status = {}", departmentId, status);
        return ResponseEntity.ok(departmentService.changeStatus(departmentId, status));
    }
}
