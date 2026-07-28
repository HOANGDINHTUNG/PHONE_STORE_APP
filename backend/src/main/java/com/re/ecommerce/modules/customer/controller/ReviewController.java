package com.re.ecommerce.modules.customer.controller;

import com.re.ecommerce.security.CustomUserDetails;
import com.re.ecommerce.modules.customer.dto.request.ReviewCreateRequest;
import com.re.ecommerce.modules.customer.dto.request.ReviewEditRequest;
import com.re.ecommerce.modules.customer.dto.response.ReviewEligibilityResponse;
import com.re.ecommerce.modules.customer.dto.response.ReviewResponse;
import com.re.ecommerce.modules.customer.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/me/review-eligibilities")
    public ResponseEntity<List<ReviewEligibilityResponse>> getReviewEligibilities(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(reviewService.getReviewEligibilities(userDetails.getUsername()));
    }

    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<Void> createReview(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable UUID productId,
            @Valid @RequestBody ReviewCreateRequest request) {
        reviewService.createReview(userDetails.getUsername(), productId, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/me/reviews")
    public ResponseEntity<List<ReviewResponse>> getMyReviews(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(reviewService.getMyReviews(userDetails.getUsername()));
    }

    @GetMapping("/me/reviews/{reviewId}")
    public ResponseEntity<ReviewResponse> getMyReviewDetail(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable UUID reviewId) {
        return ResponseEntity.ok(reviewService.getMyReviewDetail(userDetails.getUsername(), reviewId));
    }

    @PatchMapping("/me/reviews/{reviewId}")
    public ResponseEntity<Void> editMyReview(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable UUID reviewId,
            @Valid @RequestBody ReviewEditRequest request) {
        reviewService.editMyReview(userDetails.getUsername(), reviewId, request);
        return ResponseEntity.ok().build();
    }
}
