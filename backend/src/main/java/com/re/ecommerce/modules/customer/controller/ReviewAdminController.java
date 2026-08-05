package com.re.ecommerce.modules.customer.controller;

import com.re.ecommerce.security.CustomUserDetails;
import com.re.ecommerce.modules.customer.dto.request.ReviewRejectRequest;
import com.re.ecommerce.modules.customer.dto.response.AdminReviewResponse;
import com.re.ecommerce.modules.customer.entity.ReviewStatus;
import com.re.ecommerce.modules.customer.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/reviews")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('REVIEW_MODERATE') or hasRole('ADMIN')")
public class ReviewAdminController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<Page<AdminReviewResponse>> getModerationQueue(
            @RequestParam(required = false) ReviewStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(reviewService.getModerationQueue(status, pageable));
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<AdminReviewResponse> getAdminReviewDetail(@PathVariable UUID reviewId) {
        return ResponseEntity.ok(reviewService.getAdminReviewDetail(reviewId));
    }

    @PostMapping("/{reviewId}/approve")
    public ResponseEntity<Void> approveReview(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable UUID reviewId) {
        reviewService.approveReview(userDetails.getUsername(), reviewId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{reviewId}/reject")
    public ResponseEntity<Void> rejectReview(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable UUID reviewId,
            @Valid @RequestBody ReviewRejectRequest request) {
        reviewService.rejectReview(userDetails.getUsername(), reviewId, request);
        return ResponseEntity.ok().build();
    }
}
