package com.re.ecommerce.modules.content.repository;

import com.re.ecommerce.modules.content.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BannerRepository extends JpaRepository<Banner, UUID> {
    List<Banner> findByStatusOrderBySortOrderAsc(String status);
    List<Banner> findAllByOrderBySortOrderAsc();
}
