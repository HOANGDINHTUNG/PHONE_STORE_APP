package com.re.ecommerce.modules.customer.repository;

import com.re.ecommerce.modules.auth.entity.CustomerProfile;
import com.re.ecommerce.modules.customer.entity.WishlistItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import com.re.ecommerce.modules.catalog.entity.Product;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, UUID> {
    Page<WishlistItem> findByCustomer(CustomerProfile customer, Pageable pageable);
    boolean existsByCustomerAndProduct(CustomerProfile customer, Product product);
    void deleteByCustomerAndProduct(CustomerProfile customer, Product product);
    void deleteAllByCustomer(CustomerProfile customer);
}
