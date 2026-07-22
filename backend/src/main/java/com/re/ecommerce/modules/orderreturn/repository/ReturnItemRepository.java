package com.re.ecommerce.modules.orderreturn.repository;

import com.re.ecommerce.modules.orderreturn.entity.ReturnItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReturnItemRepository extends JpaRepository<ReturnItem, Long> {
}
