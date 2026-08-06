package com.re.ecommerce.modules.inventory.service;

import com.re.ecommerce.modules.order.entity.Order;
import com.re.ecommerce.modules.order.entity.OrderItem;

import java.util.List;
import java.util.UUID;

public interface StockReservationService {
    void reserveForOrder(Order order, List<OrderItem> items);
    void releaseForOrder(UUID orderId, String reason);
    void releaseExpiredReservations();
    void confirmForFulfillment(UUID orderId);
}
