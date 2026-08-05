package com.re.ecommerce.modules.cart.service;

import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.common.exception.UnprocessableEntityException;
import com.re.ecommerce.modules.auth.entity.CustomerProfile;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.CustomerProfileRepository;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.cart.dto.request.CouponCreateRequest;
import com.re.ecommerce.modules.cart.dto.request.CouponTargetsRequest;
import com.re.ecommerce.modules.cart.dto.request.CouponUpdateRequest;
import com.re.ecommerce.modules.cart.dto.response.*;
import com.re.ecommerce.modules.cart.entity.*;
import com.re.ecommerce.modules.cart.repository.*;
import com.re.ecommerce.modules.catalog.entity.Brand;
import com.re.ecommerce.modules.catalog.entity.Category;
import com.re.ecommerce.modules.catalog.entity.Product;
import com.re.ecommerce.modules.catalog.repository.BrandRepository;
import com.re.ecommerce.modules.catalog.repository.CategoryRepository;
import com.re.ecommerce.modules.catalog.repository.ProductRepository;
import com.re.ecommerce.modules.order.repository.CouponUsageRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final UserVoucherRepository userVoucherRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CouponUsageRepository couponUsageRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;

    @Override
    @Transactional
    public CouponResponse createCoupon(CouponCreateRequest request) {
        if (couponRepository.findByCodeIgnoreCase(request.getCode().trim()).isPresent()) {
            throw new BusinessConflictException("COUPON_EXISTS", "Voucher với mã này đã tồn tại trong hệ thống");
        }

        Coupon coupon = new Coupon();
        coupon.setCode(request.getCode().trim().toUpperCase());
        coupon.setName(request.getName().trim());
        coupon.setBadgeText(request.getBadgeText() != null ? request.getBadgeText().trim() : null);
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
        coupon.setMinMembershipTier(request.getMinMembershipTier() != null ? request.getMinMembershipTier() : "ALL");
        coupon.setIsStackable(Boolean.TRUE.equals(request.getIsStackable()));
        coupon.setIsFeatured(Boolean.TRUE.equals(request.getIsFeatured()));
        coupon.setStatus(CouponStatus.ACTIVE); // Auto activate on creation
        coupon.setUsedCount(0);

        coupon = couponRepository.save(coupon);
        return mapToResponse(coupon, null, null, null);
    }

    @Override
    @Transactional(readOnly = true)
    public CouponResponse getCoupon(UUID id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("COUPON_NOT_FOUND", "Mã voucher không tồn tại"));
        return mapToResponse(coupon, null, null, null);
    }

    @Override
    @Transactional
    public CouponResponse updateCoupon(UUID id, CouponUpdateRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("COUPON_NOT_FOUND", "Mã voucher không tồn tại"));

        couponRepository.findByCodeIgnoreCase(request.getCode().trim())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new BusinessConflictException("COUPON_EXISTS", "Mã voucher đã tồn tại");
                });

        coupon.setCode(request.getCode().trim().toUpperCase());
        coupon.setName(request.getName().trim());
        if (request.getBadgeText() != null) coupon.setBadgeText(request.getBadgeText().trim());
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
        if (request.getMinMembershipTier() != null) coupon.setMinMembershipTier(request.getMinMembershipTier());
        if (request.getIsStackable() != null) coupon.setIsStackable(request.getIsStackable());
        if (request.getIsFeatured() != null) coupon.setIsFeatured(request.getIsFeatured());

        return mapToResponse(couponRepository.save(coupon), null, null, null);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CouponResponse> searchCoupons(String code, CouponStatus status, Pageable pageable) {
        return couponRepository.searchCoupons(code, status, pageable)
                .map(c -> mapToResponse(c, null, null, null));
    }

    @Override
    @Transactional
    public CouponResponse updateCouponStatus(UUID id, CouponStatus status) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("COUPON_NOT_FOUND", "Mã voucher không tồn tại"));
        coupon.setStatus(status);
        coupon = couponRepository.save(coupon);
        return mapToResponse(coupon, null, null, null);
    }

    @Override
    @Transactional
    public CouponResponse assignTargets(UUID id, CouponTargetsRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("COUPON_NOT_FOUND", "Mã voucher không tồn tại"));

        if (Boolean.TRUE.equals(coupon.getAppliesToAll())) {
            throw new BusinessConflictException("GLOBAL_COUPON", "Không thể gán phạm vi cho Voucher áp dụng toàn shop");
        }

        if (request.getBrandIds() != null && !request.getBrandIds().isEmpty()) {
            coupon.setBrandTargets(new HashSet<>(brandRepository.findAllById(request.getBrandIds())));
        }
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            coupon.setCategoryTargets(new HashSet<>(categoryRepository.findAllById(request.getCategoryIds())));
        }
        if (request.getProductIds() != null && !request.getProductIds().isEmpty()) {
            coupon.setProductTargets(new HashSet<>(productRepository.findAllById(request.getProductIds())));
        }

        coupon = couponRepository.save(coupon);
        return mapToResponse(coupon, null, null, null);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CouponUsageResponse> getCouponUsages(UUID id, Pageable pageable) {
        if (!couponRepository.existsById(id)) {
            throw new ResourceNotFoundException("COUPON_NOT_FOUND", "Mã voucher không tồn tại");
        }
        return couponUsageRepository.findByCouponIdOrderByCreatedAtDesc(id, pageable)
                .map(usage -> new CouponUsageResponse(
                        usage.getId(), usage.getOrder().getOrderCode(),
                        usage.getCustomer() == null ? "Khách vãng lai" : usage.getCustomer().getUsername(),
                        usage.getDiscountAmount(), usage.getUsageStatus(),
                        usage.getConsumedAt() != null ? usage.getConsumedAt() : usage.getReservedAt() != null ? usage.getReservedAt() : usage.getCreatedAt()));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CouponResponse> getFeaturedVouchers(UUID currentUserId) {
        LocalDateTime now = LocalDateTime.now();
        List<Coupon> featured = couponRepository.findActiveFeaturedVouchers(now);
        return featured.stream()
                .map(c -> mapToResponse(c, currentUserId, null, null))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CouponResponse> getProductVouchers(UUID productId, UUID currentUserId) {
        LocalDateTime now = LocalDateTime.now();
        Product product = productRepository.findById(productId).orElse(null);
        UUID categoryId = (product != null && product.getCategory() != null) ? product.getCategory().getId() : null;
        UUID brandId = (product != null && product.getBrand() != null) ? product.getBrand().getId() : null;

        List<Coupon> vouchers = couponRepository.findActiveVouchersForProduct(productId, categoryId, brandId, now);

        BigDecimal price = BigDecimal.ZERO;
        if (product != null && product.getVariants() != null && !product.getVariants().isEmpty()) {
            com.re.ecommerce.modules.catalog.entity.ProductVariant v = product.getVariants().get(0);
            price = v.getSalePrice() != null ? v.getSalePrice() : v.getListPrice();
        }
        BigDecimal maxSavings = BigDecimal.ZERO;
        UUID bestVoucherId = null;

        List<CouponResponse> responses = new ArrayList<>();
        for (Coupon c : vouchers) {
            BigDecimal savings = computeDiscount(c, price);
            if (savings.compareTo(maxSavings) > 0) {
                maxSavings = savings;
                bestVoucherId = c.getId();
            }
            CouponResponse resp = mapToResponse(c, currentUserId, price, null);
            resp.setEstimatedSavings(savings);
            responses.add(resp);
        }

        final UUID topId = bestVoucherId;
        responses.forEach(r -> r.setIsBestVoucher(r.getId().equals(topId)));

        return responses;
    }

    @Override
    @Transactional
    public CouponResponse claimVoucher(UUID couponId, UUID userId) {
        if (userId == null) {
            throw new UnprocessableEntityException("AUTH_REQUIRED", "Vui lòng đăng nhập để lưu voucher vào kho");
        }

        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new ResourceNotFoundException("COUPON_NOT_FOUND", "Mã voucher không tồn tại"));

        if (coupon.getStatus() != CouponStatus.ACTIVE) {
            throw new BusinessConflictException("COUPON_DISABLED", "Voucher hiện đang bị khóa hoặc ngừng phát hành");
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(coupon.getStartTime())) {
            throw new BusinessConflictException("COUPON_NOT_STARTED", "Voucher chưa tới thời gian sử dụng");
        }
        if (now.isAfter(coupon.getEndTime())) {
            throw new BusinessConflictException("COUPON_EXPIRED", "Voucher đã hết hạn sử dụng");
        }

        if (coupon.getTotalUsageLimit() != null && coupon.getUsedCount() >= coupon.getTotalUsageLimit()) {
            throw new BusinessConflictException("COUPON_DEPLETED", "Voucher đã hết số lượt sử dụng trên hệ thống");
        }

        if (userVoucherRepository.existsByUserIdAndCouponId(userId, couponId)) {
            throw new BusinessConflictException("ALREADY_CLAIMED", "Bạn đã lưu voucher này trong kho rồi");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND", "Không tìm thấy người dùng"));

        UserVoucher userVoucher = new UserVoucher();
        userVoucher.setUser(user);
        userVoucher.setCoupon(coupon);
        userVoucher.setStatus(UserVoucherStatus.AVAILABLE);
        userVoucher.setClaimedAt(now);

        userVoucherRepository.save(userVoucher);

        CouponResponse resp = mapToResponse(coupon, userId, null, null);
        resp.setIsClaimed(true);
        return resp;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CouponResponse> getMyWalletVouchers(UUID userId, UserVoucherStatus status, Pageable pageable) {
        if (userId == null) {
            return Page.empty();
        }

        LocalDateTime now = LocalDateTime.now();

        if (status == UserVoucherStatus.EXPIRED) {
            Page<UserVoucher> uvPage = userVoucherRepository.findByUserIdAndStatusOrderByClaimedAtDesc(userId, UserVoucherStatus.AVAILABLE, pageable);
            List<CouponResponse> list = uvPage.getContent().stream()
                    .filter(uv -> uv.getCoupon().getEndTime().isBefore(now))
                    .map(uv -> {
                        CouponResponse res = mapToResponse(uv.getCoupon(), userId, null, null);
                        res.setIsClaimed(true);
                        res.setIsEligible(false);
                        res.setIneligibilityReason("Voucher đã hết hạn");
                        return res;
                    }).toList();
            return new PageImpl<>(list, pageable, uvPage.getTotalElements());
        }

        Page<UserVoucher> uvPage = userVoucherRepository.findByUserIdAndStatusOrderByClaimedAtDesc(userId, status != null ? status : UserVoucherStatus.AVAILABLE, pageable);

        List<CouponResponse> responses = uvPage.getContent().stream()
                .map(uv -> {
                    CouponResponse res = mapToResponse(uv.getCoupon(), userId, null, null);
                    res.setIsClaimed(true);
                    return res;
                }).toList();

        return new PageImpl<>(responses, pageable, uvPage.getTotalElements());
    }

    @Override
    @Transactional
    public CartResponse applyVoucherToCart(UUID customerId, byte[] guestTokenHash, String code) {
        if (code == null || code.isBlank()) {
            throw new UnprocessableEntityException("CODE_REQUIRED", "Vui lòng nhập mã giảm giá");
        }

        Coupon coupon = couponRepository.findByCodeIgnoreCase(code.trim())
                .orElseThrow(() -> new ResourceNotFoundException("COUPON_NOT_FOUND", "Mã giảm giá \"" + code.trim() + "\" không tồn tại trên hệ thống"));

        Cart cart = findCart(customerId, guestTokenHash);

        validateCouponForCart(coupon, cart, customerId);

        cart.setAppliedCoupon(coupon);
        cartRepository.save(cart);

        return buildCartResponseWithVoucher(cart);
    }

    @Override
    @Transactional
    public CartResponse removeVoucherFromCart(UUID customerId, byte[] guestTokenHash) {
        Cart cart = findCart(customerId, guestTokenHash);
        cart.setAppliedCoupon(null);
        cartRepository.save(cart);
        return buildCartResponseWithVoucher(cart);
    }

    @Override
    @Transactional(readOnly = true)
    public CouponQuoteResponse calculateVoucherQuote(UUID couponId, UUID customerId, byte[] guestTokenHash) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new ResourceNotFoundException("COUPON_NOT_FOUND", "Voucher không tồn tại"));

        Cart cart = findCart(customerId, guestTokenHash);
        BigDecimal subtotal = calculateCartSubtotal(cart);

        BigDecimal discount = computeDiscount(coupon, subtotal);
        BigDecimal finalTotal = subtotal.subtract(discount).max(BigDecimal.ZERO);

        return CouponQuoteResponse.builder()
                .couponId(coupon.getId())
                .couponCode(coupon.getCode())
                .couponName(coupon.getName())
                .discountValue(discount)
                .subtotal(subtotal)
                .grandTotal(finalTotal)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public VoucherAnalyticsResponse getAdminAnalytics() {
        long totalVouchers = couponRepository.count();
        List<Coupon> activeVouchers = couponRepository.findActivePublicVouchers(LocalDateTime.now());

        long totalRedemptions = couponUsageRepository.count();
        BigDecimal totalDiscountIssued = couponUsageRepository.findAll().stream()
                .map(u -> u.getDiscountAmount() != null ? u.getDiscountAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalRevenue = couponUsageRepository.findAll().stream()
                .filter(u -> u.getOrder() != null && u.getOrder().getGrandTotalAmount() != null)
                .map(u -> u.getOrder().getGrandTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return VoucherAnalyticsResponse.builder()
                .totalVouchersCount(totalVouchers)
                .activeVouchersCount(activeVouchers.size())
                .totalRedemptionsCount(totalRedemptions)
                .totalDiscountAmountIssued(totalDiscountIssued)
                .totalVoucherDrivenRevenue(totalRevenue)
                .build();
    }

    // Helper validation and mapping methods
    private void validateCouponForCart(Coupon coupon, Cart cart, UUID customerId) {
        if (coupon.getStatus() != CouponStatus.ACTIVE) {
            throw new BusinessConflictException("COUPON_DISABLED", "Mã giảm giá đã bị khóa hoặc ngừng áp dụng");
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(coupon.getStartTime())) {
            throw new BusinessConflictException("COUPON_NOT_STARTED", "Mã giảm giá chưa tới thời gian khuyến mãi");
        }
        if (now.isAfter(coupon.getEndTime())) {
            throw new BusinessConflictException("COUPON_EXPIRED", "Voucher đã hết hạn sử dụng");
        }

        if (coupon.getTotalUsageLimit() != null && coupon.getUsedCount() >= coupon.getTotalUsageLimit()) {
            throw new BusinessConflictException("COUPON_DEPLETED", "Mã giảm giá đã hết số lượt sử dụng");
        }

        if (customerId != null && coupon.getPerCustomerLimit() != null) {
            long usedCount = userVoucherRepository.countUsedByUser(customerId, coupon.getId());
            if (usedCount >= coupon.getPerCustomerLimit()) {
                throw new BusinessConflictException("CUSTOMER_LIMIT_REACHED", "Bạn đã sử dụng hết số lần cho phép của mã giảm giá này");
            }
        }

        BigDecimal subtotal = calculateCartSubtotal(cart);

        if (coupon.getMinimumOrderValue() != null && subtotal.compareTo(coupon.getMinimumOrderValue()) < 0) {
            String reqStr = String.format("%,dđ", coupon.getMinimumOrderValue().longValue());
            throw new UnprocessableEntityException("MIN_ORDER_UNMET", "Đơn hàng chưa đủ điều kiện tối thiểu " + reqStr);
        }

        // Scope verification (Brand, Category, Product targets)
        if (!Boolean.TRUE.equals(coupon.getAppliesToAll())) {
            boolean matched = checkCartMatchesScope(cart, coupon);
            if (!matched) {
                throw new UnprocessableEntityException("SCOPE_MISMATCH", "Voucher không áp dụng cho sản phẩm trong giỏ hàng của bạn");
            }
        }
    }

    private boolean checkCartMatchesScope(Cart cart, Coupon coupon) {
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            return false;
        }

        Set<UUID> brandTargetIds = coupon.getBrandTargets().stream().map(Brand::getId).collect(Collectors.toSet());
        Set<UUID> categoryTargetIds = coupon.getCategoryTargets().stream().map(Category::getId).collect(Collectors.toSet());
        Set<UUID> productTargetIds = coupon.getProductTargets().stream().map(Product::getId).collect(Collectors.toSet());

        for (CartItem item : cart.getItems()) {
            if (item.getProductVariant() == null || item.getProductVariant().getProduct() == null) continue;
            Product product = item.getProductVariant().getProduct();

            if (productTargetIds.contains(product.getId())) return true;
            if (product.getCategory() != null && categoryTargetIds.contains(product.getCategory().getId())) return true;
            if (product.getBrand() != null && brandTargetIds.contains(product.getBrand().getId())) return true;
        }

        return false;
    }

    private BigDecimal calculateCartSubtotal(Cart cart) {
        BigDecimal subtotal = BigDecimal.ZERO;
        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                if (item.getProductVariant() != null) {
                    BigDecimal price = item.getProductVariant().getSalePrice() != null ?
                            item.getProductVariant().getSalePrice() : item.getProductVariant().getListPrice();
                    subtotal = subtotal.add(price.multiply(BigDecimal.valueOf(item.getQuantity())));
                }
            }
        }
        return subtotal;
    }

    private BigDecimal computeDiscount(Coupon coupon, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) return BigDecimal.ZERO;

        BigDecimal discount = BigDecimal.ZERO;
        if (coupon.getType() == CouponType.PERCENT) {
            discount = amount.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (coupon.getMaximumDiscountAmount() != null && discount.compareTo(coupon.getMaximumDiscountAmount()) > 0) {
                discount = coupon.getMaximumDiscountAmount();
            }
        } else if (coupon.getType() == CouponType.AMOUNT) {
            discount = coupon.getDiscountValue();
        }

        return discount.min(amount);
    }

    private Cart findCart(UUID customerId, byte[] guestTokenHash) {
        if (customerId != null) {
            CustomerProfile profile = customerProfileRepository.findById(customerId)
                    .orElseThrow(() -> new ResourceNotFoundException("CUSTOMER_NOT_FOUND", "Khách hàng không tồn tại"));
            return cartRepository.findByCustomer(profile)
                    .orElseThrow(() -> new ResourceNotFoundException("CART_NOT_FOUND", "Giỏ hàng trống"));
        } else if (guestTokenHash != null) {
            return cartRepository.findByGuestTokenHash(guestTokenHash)
                    .orElseThrow(() -> new ResourceNotFoundException("CART_NOT_FOUND", "Giỏ hàng trống"));
        }
        throw new UnprocessableEntityException("MISSING_IDENTIFIER", "X-Guest-Token hoặc phiên đăng nhập bị thiếu");
    }

    private CartResponse buildCartResponseWithVoucher(Cart cart) {
        List<CartItemResponse> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        List<String> warnings = new ArrayList<>();

        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                BigDecimal price = item.getProductVariant().getSalePrice() != null ?
                        item.getProductVariant().getSalePrice() : item.getProductVariant().getListPrice();
                BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));
                subtotal = subtotal.add(lineTotal);

                items.add(CartItemResponse.builder()
                        .id(item.getId())
                        .productVariantId(item.getProductVariant().getId())
                        .productVariantName(item.getProductVariant().getName())
                        .sku(item.getProductVariant().getSku())
                        .quantity(item.getQuantity())
                        .unitPrice(price)
                        .lineTotal(lineTotal)
                        .build());
            }
        }

        Coupon coupon = cart.getAppliedCoupon();
        BigDecimal discount = BigDecimal.ZERO;
        UUID appliedId = null;
        String appliedCode = null;
        String appliedName = null;

        if (coupon != null) {
            try {
                validateCouponForCart(coupon, cart, cart.getCustomer() != null ? cart.getCustomer().getId() : null);
                discount = computeDiscount(coupon, subtotal);
                appliedId = coupon.getId();
                appliedCode = coupon.getCode();
                appliedName = coupon.getName();
            } catch (Exception e) {
                // Auto-revoke if no longer eligible
                cart.setAppliedCoupon(null);
                cartRepository.save(cart);
                warnings.add("Voucher \"" + coupon.getCode() + "\" đã bị tự động hủy vì đơn hàng không còn đủ điều kiện (" + e.getMessage() + ").");
            }
        }

        BigDecimal grandTotal = subtotal.subtract(discount).max(BigDecimal.ZERO);

        return CartResponse.builder()
                .id(cart.getId())
                .items(items)
                .subtotalAmount(subtotal)
                .discountAmount(discount)
                .grandTotal(grandTotal)
                .appliedCouponId(appliedId)
                .appliedCouponCode(appliedCode)
                .appliedCouponName(appliedName)
                .warnings(warnings)
                .build();
    }

    private CouponResponse mapToResponse(Coupon c, UUID currentUserId, BigDecimal cartAmount, UUID bestId) {
        boolean claimed = currentUserId != null && userVoucherRepository.existsByUserIdAndCouponId(currentUserId, c.getId());

        List<UUID> bIds = c.getBrandTargets().stream().map(Brand::getId).toList();
        List<UUID> catIds = c.getCategoryTargets().stream().map(Category::getId).toList();
        List<UUID> pIds = c.getProductTargets().stream().map(Product::getId).toList();

        BigDecimal savings = cartAmount != null ? computeDiscount(c, cartAmount) : BigDecimal.ZERO;

        return CouponResponse.builder()
                .id(c.getId())
                .code(c.getCode())
                .name(c.getName())
                .badgeText(c.getBadgeText())
                .description(c.getDescription())
                .type(c.getType())
                .discountValue(c.getDiscountValue())
                .appliesToAll(c.getAppliesToAll())
                .minimumOrderValue(c.getMinimumOrderValue())
                .maximumDiscountAmount(c.getMaximumDiscountAmount())
                .startTime(c.getStartTime())
                .endTime(c.getEndTime())
                .perCustomerLimit(c.getPerCustomerLimit())
                .totalUsageLimit(c.getTotalUsageLimit())
                .minMembershipTier(c.getMinMembershipTier())
                .isStackable(c.getIsStackable())
                .isFeatured(c.getIsFeatured())
                .status(c.getStatus())
                .usedCount(c.getUsedCount())
                .brandIds(bIds)
                .categoryIds(catIds)
                .productIds(pIds)
                .isClaimed(claimed)
                .isEligible(c.getStatus() == CouponStatus.ACTIVE && LocalDateTime.now().isBefore(c.getEndTime()))
                .estimatedSavings(savings)
                .isBestVoucher(c.getId().equals(bestId))
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
