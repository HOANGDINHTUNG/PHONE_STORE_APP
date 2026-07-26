package com.re.ecommerce.modules.customer.repository;

import com.re.ecommerce.modules.auth.entity.CustomerProfile;
import com.re.ecommerce.modules.customer.entity.WishlistItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, UUID> {
    Page<WishlistItem> findByCustomer(CustomerProfile customer, Pageable pageable);
    boolean existsByCustomerAndProductId(CustomerProfile customer, UUID productId);
    void deleteByCustomerAndProductId(CustomerProfile customer, UUID productId);
    void deleteAllByCustomer(CustomerProfile customer);
}
