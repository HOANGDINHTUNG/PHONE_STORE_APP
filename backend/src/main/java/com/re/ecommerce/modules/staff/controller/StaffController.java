package com.re.ecommerce.modules.staff.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.modules.staff.dto.request.StaffProfileRequest;
import com.re.ecommerce.modules.staff.dto.request.StaffProfileUpdateAdminRequest;
import com.re.ecommerce.modules.staff.dto.response.StaffProfileResponse;
import com.re.ecommerce.modules.staff.entity.EmploymentStatus;
import com.re.ecommerce.modules.staff.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Tag(name = "3. Organization Management")
@RestController
@RequestMapping("/api/v1/admin/staff")
@RequiredArgsConstructor
@Slf4j
public class StaffController {

    private final StaffService staffService;

    @GetMapping
    @PreAuthorize("hasAuthority('USER_VIEW') or hasRole('ADMIN')")
    public ResponseEntity<PagedResponse<StaffProfileResponse>> listStaff(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(staffService.listStaff(keyword, page, size));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('STAFF_CREATE') or hasRole('ADMIN')")
    public ResponseEntity<StaffProfileResponse> createStaff(@Valid @RequestBody StaffProfileRequest request) {

        StaffProfileResponse response = staffService.createStaff(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('USER_VIEW') or hasRole('ADMIN')")
    public ResponseEntity<StaffProfileResponse> getStaffDetail(
            @PathVariable UUID userId) {

        return ResponseEntity.ok(staffService.getStaffDetail(userId));
    }

    @PatchMapping("/{userId}")
    @PreAuthorize("hasAuthority('STAFF_UPDATE') or hasRole('ADMIN')")
    public ResponseEntity<StaffProfileResponse> updateStaffProfile(
            @PathVariable UUID userId,
            @Valid @RequestBody StaffProfileUpdateAdminRequest request) {

        return ResponseEntity.ok(staffService.updateStaffProfile(userId, request));
    }

    @PatchMapping("/{userId}/employment-status")
    @PreAuthorize("hasAuthority('STAFF_UPDATE') or hasRole('ADMIN')")
    public ResponseEntity<StaffProfileResponse> changeEmploymentStatus(
            @PathVariable UUID userId,
            @RequestParam EmploymentStatus status) {

        return ResponseEntity.ok(staffService.changeEmploymentStatus(userId, status));
    }
}
