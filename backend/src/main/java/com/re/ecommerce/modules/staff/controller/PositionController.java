package com.re.ecommerce.modules.staff.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.modules.staff.dto.request.PositionRequest;
import com.re.ecommerce.modules.staff.dto.response.PositionResponse;
import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import com.re.ecommerce.modules.staff.service.PositionService;
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
@RequestMapping("/api/v1/admin/positions")
@RequiredArgsConstructor
@Slf4j
public class PositionController {
    
    private final PositionService positionService;

    @GetMapping
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<PagedResponse<PositionResponse>> listPositions(
            @RequestParam(required = false) UUID departmentId,
            @RequestParam(required = false) OrganizationStatus status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(positionService.listPositions(departmentId, status, keyword, page, size));
    }

    @GetMapping("/{positionId}")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<PositionResponse> getPositionById(@PathVariable UUID positionId) {
        return ResponseEntity.ok(positionService.getPosition(positionId));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('POSITION_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<PositionResponse> createPosition(@Valid @RequestBody PositionRequest request) {

        PositionResponse response = positionService.createPosition(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{positionId}")
    @PreAuthorize("hasAuthority('POSITION_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<PositionResponse> updatePosition(
            @PathVariable UUID positionId,
            @Valid @RequestBody PositionRequest request) {

        return ResponseEntity.ok(positionService.updatePosition(positionId, request));
    }

    @PatchMapping("/{positionId}/status")
    @PreAuthorize("hasAuthority('POSITION_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<PositionResponse> changePositionStatus(
            @PathVariable UUID positionId,
            @RequestParam OrganizationStatus status) {

        return ResponseEntity.ok(positionService.changeStatus(positionId, status));
    }
}
