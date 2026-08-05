package com.re.ecommerce.modules.cart.service;

import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.cart.dto.request.CouponCreateRequest;
import com.re.ecommerce.modules.cart.dto.request.CouponTargetsRequest;
import com.re.ecommerce.modules.cart.dto.request.CouponUpdateRequest;
import com.re.ecommerce.modules.cart.dto.response.CouponResponse;
import com.re.ecommerce.modules.cart.dto.response.CouponUsageResponse;
import com.re.ecommerce.modules.cart.entity.Coupon;
import com.re.ecommerce.modules.cart.entity.CouponStatus;
import com.re.ecommerce.modules.cart.repository.CouponRepository;
import com.re.ecommerce.modules.catalog.repository.BrandRepository;
import com.re.ecommerce.modules.catalog.repository.CategoryRepository;
import com.re.ecommerce.modules.catalog.repository.ProductRepository;
import com.re.ecommerce.modules.order.repository.CouponUsageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CouponUsageRepository couponUsageRepository;

    @Override
    @Transactional
    public CouponResponse createCoupon(CouponCreateRequest request) {
        if (couponRepository.findByCode(request.getCode()).isPresent()) {
            throw new BusinessConflictException("COUPON_EXISTS", "Coupon with this code already exists");
        }

        Coupon coupon = new Coupon();
        coupon.setCode(request.getCode().trim().toUpperCase());
        coupon.setName(request.getName().trim());
        coupon.setDescription(request.getDescription());
        coupon.setType(request.getType());
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setAppliesToAll(request.getAppliesToAll());
        coupon.setMinimumOrderValue(request.getMinimumOrderValue());
        coupon.setMaximumDiscountAmount(request.getMaximumDiscountAmount());
        coupon.setStartTime(request.getStartTime());
        coupon.setEndTime(request.getEndTime());
        coupon.setPerCustomerLimit(request.getPerCustomerLimit());
        coupon.setTotalUsageLimit(request.getTotalUsageLimit());
        coupon.setStatus(CouponStatus.INACTIVE); // Created as inactive initially
        coupon.setUsedCount(0);

        coupon = couponRepository.save(coupon);
        return mapToResponse(coupon);
    }

    @Override
    @Transactional(readOnly = true)
    public CouponResponse getCoupon(UUID id) {
        return couponRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("COUPON_NOT_FOUND", "Coupon not found"));
    }

    @Override
    @Transactional
    public CouponResponse updateCoupon(UUID id, CouponUpdateRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("COUPON_NOT_FOUND", "Coupon not found"));
        couponRepository.findByCode(request.getCode())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> { throw new BusinessConflictException("COUPON_EXISTS", "Coupon with this code already exists"); });
        coupon.setCode(request.getCode().trim().toUpperCase());
        coupon.setName(request.getName().trim());
        coupon.setDescription(request.getDescription());
        coupon.setType(request.getType());
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setAppliesToAll(request.getAppliesToAll());
        coupon.setMinimumOrderValue(request.getMinimumOrderValue());
        coupon.setMaximumDiscountAmount(request.getMaximumDiscountAmount());
        coupon.setStartTime(request.getStartTime());
        coupon.setEndTime(request.getEndTime());
        coupon.setPerCustomerLimit(request.getPerCustomerLimit());
        coupon.setTotalUsageLimit(request.getTotalUsageLimit());
        return mapToResponse(couponRepository.save(coupon));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CouponResponse> searchCoupons(String code, CouponStatus status, Pageable pageable) {
        return couponRepository.searchCoupons(code, status, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public CouponResponse updateCouponStatus(UUID id, CouponStatus status) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("COUPON_NOT_FOUND", "Coupon not found"));
        coupon.setStatus(status);
        coupon = couponRepository.save(coupon);
        return mapToResponse(coupon);
    }

    @Override
    @Transactional
    public CouponResponse assignTargets(UUID id, CouponTargetsRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("COUPON_NOT_FOUND", "Coupon not found"));

        if (Boolean.TRUE.equals(coupon.getAppliesToAll())) {
            throw new BusinessConflictException("GLOBAL_COUPON", "Cannot assign specific targets to a global coupon");
        }

        coupon.setBrandTargets(new HashSet<>(brandRepository.findAllById(request.getBrandIds())));
        coupon.setCategoryTargets(new HashSet<>(categoryRepository.findAllById(request.getCategoryIds())));
        coupon.setProductTargets(new HashSet<>(productRepository.findAllById(request.getProductIds())));

        coupon = couponRepository.save(coupon);
        return mapToResponse(coupon);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CouponUsageResponse> getCouponUsages(UUID id, Pageable pageable) {
        if (!couponRepository.existsById(id)) {
            throw new ResourceNotFoundException("COUPON_NOT_FOUND", "Coupon not found");
        }
        return couponUsageRepository.findByCouponIdOrderByCreatedAtDesc(id, pageable)
                .map(usage -> new CouponUsageResponse(
                        usage.getId(), usage.getOrder().getOrderCode(),
                        usage.getCustomer() == null ? "Khách vãng lai" : usage.getCustomer().getUsername(),
                        usage.getDiscountAmount(), usage.getUsageStatus(),
                        usage.getConsumedAt() != null ? usage.getConsumedAt() : usage.getReservedAt() != null ? usage.getReservedAt() : usage.getCreatedAt()));
    }

    private CouponResponse mapToResponse(Coupon coupon) {
        return CouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .name(coupon.getName())
                .description(coupon.getDescription())
                .type(coupon.getType())
                .discountValue(coupon.getDiscountValue())
                .appliesToAll(coupon.getAppliesToAll())
                .minimumOrderValue(coupon.getMinimumOrderValue())
                .maximumDiscountAmount(coupon.getMaximumDiscountAmount())
                .startTime(coupon.getStartTime())
                .endTime(coupon.getEndTime())
                .perCustomerLimit(coupon.getPerCustomerLimit())
                .totalUsageLimit(coupon.getTotalUsageLimit())
                .status(coupon.getStatus())
                .usedCount(coupon.getUsedCount())
                .createdAt(coupon.getCreatedAt())
                .updatedAt(coupon.getUpdatedAt())
                .build();
    }
}
