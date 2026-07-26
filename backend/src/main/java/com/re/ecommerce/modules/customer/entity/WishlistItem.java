package com.re.ecommerce.modules.customer.entity;

import com.re.ecommerce.common.entity.BaseEntity;
import com.re.ecommerce.modules.auth.entity.CustomerProfile;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "wishlist_items", uniqueConstraints = {
    @UniqueConstraint(name = "uk_wishlist_customer_product", columnNames = {"customer_id", "product_id"})
})
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WishlistItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private CustomerProfile customer;

    @Column(name = "product_id", nullable = false)
    private UUID productId;

    public WishlistItem(CustomerProfile customer, UUID productId) {
        this.customer = customer;
        this.productId = productId;
    }
}
