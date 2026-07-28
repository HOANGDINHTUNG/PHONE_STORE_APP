package com.re.ecommerce.modules.customer.controller;

import com.re.ecommerce.modules.catalog.dto.response.ProductRatingSummaryResponse;
import com.re.ecommerce.modules.customer.dto.response.ReviewResponse;
import com.re.ecommerce.modules.customer.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products/{productSlug}")
@RequiredArgsConstructor
public class ReviewPublicController {

    private final ReviewService reviewService;

    @GetMapping("/reviews")
    public ResponseEntity<Page<ReviewResponse>> getPublicApprovedReviews(
            @PathVariable String productSlug,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(reviewService.getPublicApprovedReviews(productSlug, pageable));
    }

    @GetMapping("/review-summary")
    public ResponseEntity<ProductRatingSummaryResponse> getProductReviewSummary(
            @PathVariable String productSlug) {
        return ResponseEntity.ok(reviewService.getProductReviewSummary(productSlug));
    }
}
