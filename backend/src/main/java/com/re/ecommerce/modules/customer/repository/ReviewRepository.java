package com.re.ecommerce.modules.customer.repository;

import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.customer.entity.Review;
import com.re.ecommerce.modules.customer.entity.ReviewStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    Page<Review> findByCustomer(User customer, Pageable pageable);
    
    Page<Review> findByStatus(ReviewStatus status, Pageable pageable);
    
    // For REVIEW-PUB-001
    Page<Review> findByOrderItem_Product_SlugAndStatus(String slug, ReviewStatus status, Pageable pageable);

    Optional<Review> findByCustomerAndId(User customer, UUID id);
    
    boolean existsByCustomerAndOrderItem_Id(User customer, UUID orderItemId);
}
