package com.re.ecommerce.modules.catalog.repository;

import com.re.ecommerce.modules.catalog.entity.ProductRatingSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProductRatingSummaryRepository extends JpaRepository<ProductRatingSummary, UUID> {
}
