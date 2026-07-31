package com.re.ecommerce.modules.order.repository;

import com.re.ecommerce.modules.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.order.enums.OrderStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
    List<OrderItem> findByOrderId(UUID orderId);
    List<OrderItem> findByOrderIdIn(List<UUID> orderIds);

    @Query("SELECT i FROM OrderItem i JOIN FETCH i.product p JOIN i.order o " +
           "WHERE o.customer = :customer AND o.completedAt IS NOT NULL " +
           "AND o.status IN :statuses " +
           "ORDER BY o.completedAt DESC")
    List<OrderItem> findCompletedOrderItemsByCustomer(
            @Param("customer") User customer,
            @Param("statuses") List<OrderStatus> statuses);
}
