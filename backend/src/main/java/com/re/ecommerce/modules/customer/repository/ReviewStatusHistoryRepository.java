package com.re.ecommerce.modules.customer.repository;

import com.re.ecommerce.modules.customer.entity.ReviewStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReviewStatusHistoryRepository extends JpaRepository<ReviewStatusHistory, UUID> {
}
