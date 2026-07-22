package com.re.ecommerce.modules.cart.repository;

import com.re.ecommerce.modules.cart.entity.Coupon;
import com.re.ecommerce.modules.cart.entity.CouponStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, UUID> {
    
    Optional<Coupon> findByCode(String code);
    
    @Query("SELECT c FROM Coupon c WHERE " +
           "(:code IS NULL OR c.code = :code) AND " +
           "(:status IS NULL OR c.status = :status)")
    Page<Coupon> searchCoupons(@Param("code") String code, 
                               @Param("status") CouponStatus status, 
                               Pageable pageable);
}
