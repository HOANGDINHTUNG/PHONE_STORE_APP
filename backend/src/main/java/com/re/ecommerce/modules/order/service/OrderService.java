package com.re.ecommerce.modules.order.service;

import com.re.ecommerce.modules.order.dto.request.CheckoutRequest;
import com.re.ecommerce.modules.order.dto.response.OrderResponse;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.common.dto.PagedResponse;

import java.util.UUID;

public interface OrderService {
    
    OrderResponse checkout(User currentUser, byte[] guestTokenHash, CheckoutRequest request);
    
    PagedResponse<OrderResponse> getMyOrders(User currentUser, int page, int size);
    
    OrderResponse getMyOrder(User currentUser, String orderCode);
    
    PagedResponse<OrderResponse> getAdminOrders(int page, int size);
    
    void confirmOrder(User admin, UUID orderId);
    
    OrderResponse getAdminOrder(UUID orderId);
    
    OrderResponse startProcessing(UUID orderId);
    
    OrderResponse completeOrder(UUID orderId);
    
    OrderResponse cancelOrder(User user, UUID orderId, String reason);
    
    OrderResponse getGuestOrder(String accessLink);
    
    String generateGuestAccessLink(String orderCode, String email);
}
