package com.re.ecommerce.modules.customer.service;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.modules.customer.dto.response.WishlistItemResponse;

import java.util.UUID;

public interface WishlistService {
    PagedResponse<WishlistItemResponse> listWishlist(String username, int page, int size);
    void addProductToWishlist(String username, UUID productId);
    void removeProductFromWishlist(String username, UUID productId);
    void clearWishlist(String username);
}
