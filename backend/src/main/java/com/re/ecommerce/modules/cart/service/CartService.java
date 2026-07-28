package com.re.ecommerce.modules.cart.service;

import com.re.ecommerce.modules.cart.dto.request.CartItemRequest;
import com.re.ecommerce.modules.cart.dto.request.CartItemUpdateQuantityRequest;
import com.re.ecommerce.modules.cart.dto.response.CartResponse;

import java.util.List;
import java.util.UUID;

public interface CartService {
    
    CartResponse getCart(UUID customerId, byte[] guestTokenHash);
    
    CartResponse addItem(UUID customerId, byte[] guestTokenHash, CartItemRequest request);
    
    CartResponse updateItemQuantity(UUID customerId, byte[] guestTokenHash, UUID cartItemId, CartItemUpdateQuantityRequest request);
    
    void removeItem(UUID customerId, byte[] guestTokenHash, UUID cartItemId);
    
    void clearCart(UUID customerId, byte[] guestTokenHash);
    
    CartResponse mergeCart(UUID customerId, byte[] guestTokenHash);
    
    CartResponse reorderItems(UUID customerId, List<CartItemRequest> items);
}
