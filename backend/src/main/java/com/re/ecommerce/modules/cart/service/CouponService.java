package com.re.ecommerce.modules.cart.service;

import com.re.ecommerce.modules.cart.dto.request.CouponCreateRequest;
import com.re.ecommerce.modules.cart.dto.request.CouponTargetsRequest;
import com.re.ecommerce.modules.cart.dto.response.CouponResponse;
import com.re.ecommerce.modules.cart.entity.CouponStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface CouponService {
    
    CouponResponse createCoupon(CouponCreateRequest request);
    
    CouponResponse getCoupon(UUID id);
    
    Page<CouponResponse> searchCoupons(String code, CouponStatus status, Pageable pageable);
    
    CouponResponse updateCouponStatus(UUID id, CouponStatus status);
    
    CouponResponse assignTargets(UUID id, CouponTargetsRequest request);
}
