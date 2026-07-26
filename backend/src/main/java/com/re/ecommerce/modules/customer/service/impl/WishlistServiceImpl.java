package com.re.ecommerce.modules.customer.service.impl;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.auth.entity.CustomerProfile;
import com.re.ecommerce.modules.auth.repository.CustomerProfileRepository;
import com.re.ecommerce.modules.customer.dto.response.WishlistItemResponse;
import com.re.ecommerce.modules.customer.entity.WishlistItem;
import com.re.ecommerce.modules.customer.repository.WishlistItemRepository;
import com.re.ecommerce.modules.customer.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistItemRepository wishlistRepository;
    private final CustomerProfileRepository customerRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<WishlistItemResponse> listWishlist(String username, int page, int size) {
        CustomerProfile customer = getCustomer(username);
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<WishlistItem> itemPage = wishlistRepository.findByCustomer(customer, pageable);
        List<WishlistItemResponse> items = itemPage.stream().map(this::mapToResponse).toList();
        return PagedResponse.of(itemPage, items);
    }

    @Override
    @Transactional
    public void addProductToWishlist(String username, UUID productId) {
        CustomerProfile customer = getCustomer(username);
        if (!wishlistRepository.existsByCustomerAndProductId(customer, productId)) {
            WishlistItem item = new WishlistItem(customer, productId);
            wishlistRepository.save(item);
        }
    }

    @Override
    @Transactional
    public void removeProductFromWishlist(String username, UUID productId) {
        CustomerProfile customer = getCustomer(username);
        wishlistRepository.deleteByCustomerAndProductId(customer, productId);
    }

    @Override
    @Transactional
    public void clearWishlist(String username) {
        CustomerProfile customer = getCustomer(username);
        wishlistRepository.deleteAllByCustomer(customer);
    }

    private CustomerProfile getCustomer(String username) {
        return customerRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("CUSTOMER_NOT_FOUND", "Không tìm thấy hồ sơ khách hàng cho user: " + username));
    }

    private WishlistItemResponse mapToResponse(WishlistItem item) {
        return new WishlistItemResponse(item.getId(), item.getProductId(), item.getCreatedAt());
    }
}
