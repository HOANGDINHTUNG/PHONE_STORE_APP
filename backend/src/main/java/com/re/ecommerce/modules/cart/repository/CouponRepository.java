package com.re.ecommerce.modules.cart.repository;

import com.re.ecommerce.modules.cart.entity.Coupon;
import com.re.ecommerce.modules.cart.entity.CouponStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, UUID> {

    Optional<Coupon> findByCode(String code);

    Optional<Coupon> findByCodeIgnoreCase(String code);

    @Query("SELECT c FROM Coupon c WHERE " +
           "(:code IS NULL OR LOWER(c.code) LIKE LOWER(CONCAT('%', :code, '%')) OR LOWER(c.name) LIKE LOWER(CONCAT('%', :code, '%'))) AND " +
           "(:status IS NULL OR c.status = :status)")
    Page<Coupon> searchCoupons(@Param("code") String code, 
                               @Param("status") CouponStatus status, 
                               Pageable pageable);

    @Query("SELECT c FROM Coupon c WHERE c.status = 'ACTIVE' AND c.isFeatured = true " +
           "AND c.startTime <= :now AND c.endTime >= :now " +
           "ORDER BY c.discountValue DESC")
    List<Coupon> findActiveFeaturedVouchers(@Param("now") LocalDateTime now);

    @Query("SELECT c FROM Coupon c WHERE c.status = 'ACTIVE' " +
           "AND c.startTime <= :now AND c.endTime >= :now " +
           "ORDER BY c.createdAt DESC")
    List<Coupon> findActivePublicVouchers(@Param("now") LocalDateTime now);

    @Query("SELECT DISTINCT c FROM Coupon c " +
           "LEFT JOIN c.productTargets p " +
           "LEFT JOIN c.categoryTargets cat " +
           "LEFT JOIN c.brandTargets b " +
           "WHERE c.status = 'ACTIVE' AND c.startTime <= :now AND c.endTime >= :now " +
           "AND (c.appliesToAll = true OR p.id = :productId OR cat.id = :categoryId OR b.id = :brandId)")
    List<Coupon> findActiveVouchersForProduct(
            @Param("productId") UUID productId,
            @Param("categoryId") UUID categoryId,
            @Param("brandId") UUID brandId,
            @Param("now") LocalDateTime now
    );

    @Modifying
    @Query("UPDATE Coupon c SET c.usedCount = c.usedCount + 1 " +
           "WHERE c.id = :couponId AND (c.totalUsageLimit IS NULL OR c.usedCount < c.totalUsageLimit)")
    int incrementUsedCountAtomic(@Param("couponId") UUID couponId);
}
