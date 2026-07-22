package com.re.ecommerce.modules.cart.controller;

import com.re.ecommerce.modules.cart.dto.request.CouponCreateRequest;
import com.re.ecommerce.modules.cart.dto.request.CouponTargetsRequest;
import com.re.ecommerce.modules.cart.dto.response.CouponResponse;
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

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/coupons")
@RequiredArgsConstructor
@Slf4j
public class AdminCouponController {

    private final CouponService couponService;

    @PostMapping
    public ResponseEntity<CouponResponse> createCoupon(@Valid @RequestBody CouponCreateRequest request) {
        log.info("Received request to create a new coupon with code: {}", request.getCode());
        CouponResponse response = couponService.createCoupon(request);
        log.info("Successfully created coupon with ID: {}", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CouponResponse> getCoupon(@PathVariable UUID id) {
        log.debug("Fetching coupon details for ID: {}", id);
        return ResponseEntity.ok(couponService.getCoupon(id));
    }

    @GetMapping
    public ResponseEntity<Page<CouponResponse>> searchCoupons(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) CouponStatus status,
            Pageable pageable) {
        log.debug("Searching coupons by code: {} and status: {}", code, status);
        return ResponseEntity.ok(couponService.searchCoupons(code, status, pageable));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CouponResponse> updateStatus(
            @PathVariable UUID id,
            @RequestParam CouponStatus status) {
        log.info("Updating coupon ID: {} to status: {}", id, status);
        return ResponseEntity.ok(couponService.updateCouponStatus(id, status));
    }

    @PostMapping("/{id}/targets")
    public ResponseEntity<CouponResponse> assignTargets(
            @PathVariable UUID id,
            @Valid @RequestBody CouponTargetsRequest request) {
        log.info("Request to assign constraints (Brand/Cat/Prod) targets to coupon ID: {}", id);
        CouponResponse response = couponService.assignTargets(id, request);
        log.info("Targets successfully assigned to coupon ID: {}", id);
        return ResponseEntity.ok(response);
    }
}
