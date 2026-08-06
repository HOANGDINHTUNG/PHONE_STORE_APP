package com.re.ecommerce.modules.cart.service;

import com.re.ecommerce.modules.cart.dto.request.CouponCreateRequest;
import com.re.ecommerce.modules.cart.dto.request.CouponTargetsRequest;
import com.re.ecommerce.modules.cart.dto.request.CouponUpdateRequest;
import com.re.ecommerce.modules.cart.dto.response.CartResponse;
import com.re.ecommerce.modules.cart.dto.response.CouponQuoteResponse;
import com.re.ecommerce.modules.cart.dto.response.CouponResponse;
import com.re.ecommerce.modules.cart.dto.response.CouponUsageResponse;
import com.re.ecommerce.modules.cart.dto.response.VoucherAnalyticsResponse;
import com.re.ecommerce.modules.cart.entity.CouponStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface CouponService {
    
    CouponResponse createCoupon(CouponCreateRequest request);
    CouponResponse getCoupon(UUID id);
    CouponResponse updateCoupon(UUID id, CouponUpdateRequest request);
    Page<CouponResponse> searchCoupons(String code, CouponStatus status, Pageable pageable);
    CouponResponse updateCouponStatus(UUID id, CouponStatus status);
    CouponResponse assignTargets(UUID id, CouponTargetsRequest request);
    Page<CouponUsageResponse> getCouponUsages(UUID id, Pageable pageable);

    // Public / Customer Wallet & Product Section APIs
    List<CouponResponse> getFeaturedVouchers(UUID currentUserId);
    List<CouponResponse> getProductVouchers(UUID productId, UUID currentUserId);
    CouponResponse claimVoucher(UUID couponId, UUID userId);
    Page<CouponResponse> getMyWalletVouchers(UUID userId, String status, Pageable pageable);

    // Cart Integration APIs
    CartResponse applyVoucherToCart(UUID customerId, byte[] guestTokenHash, String code);
    CartResponse removeVoucherFromCart(UUID customerId, byte[] guestTokenHash);
    CouponQuoteResponse calculateVoucherQuote(UUID couponId, UUID customerId, byte[] guestTokenHash);

    // Admin & Analytics
    VoucherAnalyticsResponse getAdminAnalytics();
}
