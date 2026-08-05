package com.re.ecommerce.modules.cart.entity;

import com.re.ecommerce.common.entity.BaseEntity;
import com.re.ecommerce.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "user_vouchers",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_user_vouchers_user_coupon", columnNames = {"user_id", "coupon_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
public class UserVoucher extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "coupon_id", nullable = false)
    private Coupon coupon;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private UserVoucherStatus status = UserVoucherStatus.AVAILABLE;

    @Column(name = "claimed_at", nullable = false)
    private LocalDateTime claimedAt = LocalDateTime.now();

    @Column(name = "used_at")
    private LocalDateTime usedAt;
}
