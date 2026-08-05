package com.re.ecommerce.modules.customer.service;

import com.re.ecommerce.modules.customer.dto.request.ReviewCreateRequest;
import com.re.ecommerce.modules.customer.dto.request.ReviewEditRequest;
import com.re.ecommerce.modules.customer.dto.response.ReviewEligibilityResponse;
import com.re.ecommerce.modules.customer.dto.response.AdminReviewResponse;
import com.re.ecommerce.modules.customer.dto.response.ReviewResponse;
import com.re.ecommerce.modules.customer.dto.request.ReviewRejectRequest;
import com.re.ecommerce.modules.customer.entity.ReviewStatus;
import com.re.ecommerce.modules.catalog.dto.response.ProductRatingSummaryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ReviewService {
    List<ReviewEligibilityResponse> getReviewEligibilities(String username);
    void createReview(String username, UUID productId, ReviewCreateRequest request);
    List<ReviewResponse> getMyReviews(String username);
    ReviewResponse getMyReviewDetail(String username, UUID reviewId);
    void editMyReview(String username, UUID reviewId, ReviewEditRequest request);

    // Admin Moderation
    Page<AdminReviewResponse> getModerationQueue(ReviewStatus status, Pageable pageable);
    AdminReviewResponse getAdminReviewDetail(UUID reviewId);
    void approveReview(String adminUsername, UUID reviewId);
    void rejectReview(String adminUsername, UUID reviewId, ReviewRejectRequest request);

    // Public
    Page<ReviewResponse> getPublicApprovedReviews(String productSlug, Pageable pageable);
    ProductRatingSummaryResponse getProductReviewSummary(String productSlug);
}
