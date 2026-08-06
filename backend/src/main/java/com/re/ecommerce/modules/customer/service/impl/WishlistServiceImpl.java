package com.re.ecommerce.modules.customer.service.impl;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.auth.entity.CustomerProfile;
import com.re.ecommerce.modules.auth.repository.CustomerProfileRepository;
import com.re.ecommerce.modules.customer.dto.response.WishlistItemResponse;
import com.re.ecommerce.modules.customer.entity.WishlistItem;
import com.re.ecommerce.modules.customer.repository.WishlistItemRepository;
import com.re.ecommerce.modules.customer.service.WishlistService;
import com.re.ecommerce.modules.catalog.repository.ProductRepository;
import com.re.ecommerce.modules.catalog.entity.Product;
import com.re.ecommerce.modules.catalog.entity.PublicationStatus;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.inventory.repository.WarehouseInventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistItemRepository wishlistRepository;
    private final CustomerProfileRepository customerRepository;
    private final ProductRepository productRepository;
    private final WarehouseInventoryRepository warehouseInventoryRepository;

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
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("PRODUCT_NOT_FOUND", "Product not found"));

        if (product.getPublicationStatus() != PublicationStatus.ACTIVE || product.getDeletedAt() != null) {
            throw new IllegalArgumentException("Product is not valid for wishlist");
        }

        if (!wishlistRepository.existsByCustomerAndProduct(customer, product)) {
            WishlistItem item = new WishlistItem(customer, product);
            wishlistRepository.save(item);
        }
    }

    @Override
    @Transactional
    public void removeProductFromWishlist(String username, UUID productId) {
        CustomerProfile customer = getCustomer(username);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("PRODUCT_NOT_FOUND", "Product not found"));
        wishlistRepository.deleteByCustomerAndProduct(customer, product);
    }

    @Override
    @Transactional
    public void clearWishlist(String username) {
        CustomerProfile customer = getCustomer(username);
        wishlistRepository.deleteAllByCustomer(customer);
    }

    private CustomerProfile getCustomer(String username) {
        return customerRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("CUSTOMER_NOT_FOUND",
                        "Không tìm thấy hồ sơ khách hàng cho user: " + username));
    }

    private WishlistItemResponse mapToResponse(WishlistItem item) {
        Product product = item.getProduct();
        List<UUID> variantIds = product.getVariants().stream().map(ProductVariant::getId).toList();
        Map<UUID, Integer> stock = warehouseInventoryRepository.sumAvailableQuantityByVariantIds(variantIds).stream()
                .collect(Collectors.toMap(WarehouseInventoryRepository.VariantAvailableStock::getVariantId,
                        row -> Math.max(0, row.getAvailableQuantity().intValue())));
        com.re.ecommerce.modules.catalog.dto.response.ProductCardResponse productCard =
                com.re.ecommerce.modules.catalog.dto.response.ProductCardResponse.fromProduct(product, stock);

        return new WishlistItemResponse(item.getId(), productCard, item.getCreatedAt());
    }
}
