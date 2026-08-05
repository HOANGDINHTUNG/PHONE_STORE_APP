package com.re.ecommerce.modules.cart.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.re.ecommerce.modules.cart.dto.request.CouponCreateRequest;
import com.re.ecommerce.modules.cart.dto.request.CouponTargetsRequest;
import com.re.ecommerce.modules.cart.dto.request.CouponUpdateRequest;
import com.re.ecommerce.modules.cart.dto.response.CouponResponse;
import com.re.ecommerce.modules.cart.dto.response.CouponUsageResponse;
import com.re.ecommerce.modules.cart.entity.CouponStatus;
import com.re.ecommerce.modules.cart.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.UUID;

@Tag(name = "8. Coupons")
@RestController
@RequestMapping("/api/v1/admin/coupons")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Slf4j
public class AdminCouponController {

    private final CouponService couponService;

    @PostMapping
    public ResponseEntity<CouponResponse> createCoupon(@Valid @RequestBody CouponCreateRequest request) {

        CouponResponse response = couponService.createCoupon(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CouponResponse> getCoupon(@PathVariable UUID id) {

        return ResponseEntity.ok(couponService.getCoupon(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CouponResponse> updateCoupon(@PathVariable UUID id, @Valid @RequestBody CouponUpdateRequest request) {
        return ResponseEntity.ok(couponService.updateCoupon(id, request));
    }

    @GetMapping
    public ResponseEntity<Page<CouponResponse>> searchCoupons(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) CouponStatus status,
            Pageable pageable) {

        return ResponseEntity.ok(couponService.searchCoupons(code, status, pageable));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CouponResponse> updateStatus(
            @PathVariable UUID id,
            @RequestParam CouponStatus status) {

        return ResponseEntity.ok(couponService.updateCouponStatus(id, status));
    }

    @PostMapping("/{id}/targets")
    public ResponseEntity<CouponResponse> assignTargets(
            @PathVariable UUID id,
            @Valid @RequestBody CouponTargetsRequest request) {

        CouponResponse response = couponService.assignTargets(id, request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/usages")
    public ResponseEntity<Page<CouponUsageResponse>> getCouponUsages(@PathVariable UUID id, Pageable pageable) {
        return ResponseEntity.ok(couponService.getCouponUsages(id, pageable));
    }
}
