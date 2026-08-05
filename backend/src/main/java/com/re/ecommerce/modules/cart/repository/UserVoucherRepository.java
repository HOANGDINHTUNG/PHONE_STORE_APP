package com.re.ecommerce.modules.cart.repository;

import com.re.ecommerce.modules.cart.entity.UserVoucher;
import com.re.ecommerce.modules.cart.entity.UserVoucherStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserVoucherRepository extends JpaRepository<UserVoucher, UUID> {

    Optional<UserVoucher> findByUserIdAndCouponId(UUID userId, UUID couponId);

    boolean existsByUserIdAndCouponId(UUID userId, UUID couponId);

    Page<UserVoucher> findByUserIdAndStatusOrderByClaimedAtDesc(UUID userId, UserVoucherStatus status, Pageable pageable);

    List<UserVoucher> findByUserIdAndStatus(UUID userId, UserVoucherStatus status);

    @Query("SELECT uv FROM UserVoucher uv JOIN FETCH uv.coupon c " +
           "WHERE uv.user.id = :userId AND uv.status = 'AVAILABLE' " +
           "AND c.status = 'ACTIVE' AND c.startTime <= :now AND c.endTime >= :now " +
           "AND c.endTime <= :expiringThreshold")
    List<UserVoucher> findExpiringSoonVouchers(
            @Param("userId") UUID userId,
            @Param("now") LocalDateTime now,
            @Param("expiringThreshold") LocalDateTime expiringThreshold
    );

    @Query("SELECT COUNT(uv) FROM UserVoucher uv WHERE uv.user.id = :userId AND uv.coupon.id = :couponId AND uv.status = 'USED'")
    long countUsedByUser(@Param("userId") UUID userId, @Param("couponId") UUID couponId);
}
