package com.re.ecommerce.modules.cart.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.re.ecommerce.modules.cart.repository.CartRepository;
import com.re.ecommerce.modules.cart.repository.CartItemRepository;
import com.re.ecommerce.modules.catalog.repository.ProductVariantRepository;
import com.re.ecommerce.modules.auth.repository.CustomerProfileRepository;
import com.re.ecommerce.modules.cart.entity.Cart;
import com.re.ecommerce.modules.cart.entity.CartItem;
import com.re.ecommerce.modules.auth.entity.CustomerProfile;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.cart.dto.request.CartItemRequest;
import com.re.ecommerce.modules.cart.dto.request.CartItemUpdateQuantityRequest;
import com.re.ecommerce.modules.cart.dto.response.CartResponse;
import com.re.ecommerce.modules.cart.dto.response.CartItemResponse;
import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.common.exception.UnprocessableEntityException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CustomerProfileRepository customerProfileRepository;

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(UUID customerId, byte[] guestTokenHash) {
        Cart cart = findCartOrCreatePseudo(customerId, guestTokenHash);
        return mapToResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addItem(UUID customerId, byte[] guestTokenHash, CartItemRequest request) {
        Cart cart = getOrCreateCart(customerId, guestTokenHash);
        ProductVariant variant = productVariantRepository.findById(request.getProductVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("PRODUCT_VARIANT_NOT_FOUND", "Product Variant not found"));

        if (!"ACTIVE".equals(variant.getProduct().getPublicationStatus().name())) {
            throw new BusinessConflictException("PRODUCT_INACTIVE", "Product is not active");
        }

        CartItem item = cartItemRepository.findByCartIdAndProductVariantId(cart.getId(), variant.getId())
                .orElse(null);

        if (item == null) {
            item = new CartItem();
            item.setCart(cart);
            item.setProductVariant(variant);
            item.setQuantity(request.getQuantity());
            cart.addItem(item);
        } else {
            item.setQuantity(item.getQuantity() + request.getQuantity());
        }

        cartItemRepository.save(item);
        
        log.info("event=cart_item_added customerId={} guestToken={} variantId={} quantity={}",
                customerId, guestTokenHash != null, request.getProductVariantId(), request.getQuantity());
                
        return mapToResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateItemQuantity(UUID customerId, byte[] guestTokenHash, UUID cartItemId, CartItemUpdateQuantityRequest request) {
        Cart cart = findCartOrCreatePseudo(customerId, guestTokenHash);
        if (cart.getId() == null) {
            throw new ResourceNotFoundException("CART_NOT_FOUND", "Cart not found");
        }

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CART_ITEM_NOT_FOUND", "Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BusinessConflictException("ITEM_NOT_IN_CART", "Cart item does not belong to this cart");
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);
        return mapToResponse(cart);
    }

    @Override
    @Transactional
    public void removeItem(UUID customerId, byte[] guestTokenHash, UUID cartItemId) {
        Cart cart = findCartOrCreatePseudo(customerId, guestTokenHash);
        if (cart.getId() == null) {
            return;
        }

        CartItem item = cartItemRepository.findById(cartItemId).orElse(null);
        if (item != null && item.getCart().getId().equals(cart.getId())) {
            cart.removeItem(item);
            cartItemRepository.delete(item);
        }
    }

    @Override
    @Transactional
    public void clearCart(UUID customerId, byte[] guestTokenHash) {
        Cart cart = findCartOrCreatePseudo(customerId, guestTokenHash);
        if (cart.getId() != null) {
            cart.getItems().clear();
            cartItemRepository.deleteByCartId(cart.getId());
        }
    }

    @Override
    @Transactional
    public CartResponse mergeCart(UUID customerId, byte[] guestTokenHash) {
        if (customerId == null || guestTokenHash == null) {
            throw new BusinessConflictException("MERGE_CONFLICT", "Both customer and guest token are required to merge");
        }

        Cart guestCart = cartRepository.findByGuestTokenHash(guestTokenHash).orElse(null);
        Cart customerCart = getOrCreateCart(customerId, null);

        if (guestCart == null || guestCart.getItems().isEmpty()) {
            return mapToResponse(customerCart);
        }

        List<UUID> guestVariantIds = guestCart.getItems().stream()
                .map(item -> item.getProductVariant().getId())
                .toList();
        Map<UUID, CartItem> existingCustomerItems = guestVariantIds.isEmpty() ? new HashMap<>() :
                cartItemRepository.findByCartIdAndProductVariantIdIn(customerCart.getId(), guestVariantIds).stream()
                .collect(Collectors.toMap(item -> item.getProductVariant().getId(), item -> item));

        for (CartItem guestItem : guestCart.getItems()) {
            CartItem existingCustomerItem = existingCustomerItems.get(guestItem.getProductVariant().getId());

            if (existingCustomerItem == null) {
                guestItem.setCart(customerCart);
                customerCart.addItem(guestItem);
                cartItemRepository.save(guestItem);
            } else {
                existingCustomerItem.setQuantity(existingCustomerItem.getQuantity() + guestItem.getQuantity());
                cartItemRepository.save(existingCustomerItem);
                cartItemRepository.delete(guestItem);
            }
        }
        guestCart.getItems().clear();
        cartRepository.delete(guestCart);

        return mapToResponse(customerCart);
    }

    @Override
    @Transactional
    public CartResponse reorderItems(UUID customerId, List<CartItemRequest> items) {
        if (items == null || items.isEmpty()) {
            throw new UnprocessableEntityException("NO_REORDERABLE_ITEMS", "No reorderable items found");
        }
        
        Cart cart = getOrCreateCart(customerId, null);
        boolean anyValid = false;
        List<String> reorderWarnings = new ArrayList<>();
        
        List<UUID> reqVariantIds = items.stream().map(CartItemRequest::getProductVariantId).toList();
        Map<UUID, ProductVariant> variantMap = reqVariantIds.isEmpty() ? new HashMap<>() : 
                productVariantRepository.findAllById(reqVariantIds).stream().collect(Collectors.toMap(ProductVariant::getId, v -> v));
        Map<UUID, CartItem> existingCartItems = reqVariantIds.isEmpty() ? new HashMap<>() : 
                cartItemRepository.findByCartIdAndProductVariantIdIn(cart.getId(), reqVariantIds).stream().collect(Collectors.toMap(item -> item.getProductVariant().getId(), item -> item));
        
        for (CartItemRequest req : items) {
            ProductVariant variant = variantMap.get(req.getProductVariantId());
            
            if (variant == null) {
                reorderWarnings.add("Product variant " + req.getProductVariantId() + " is no longer available");
                continue;
            }
            if (!"ACTIVE".equals(variant.getProduct().getPublicationStatus().name())) {
                reorderWarnings.add("Product " + variant.getSku() + " is no longer active");
                continue;
            }
            if (!"ACTIVE".equals(variant.getStatus().name()) || variant.getProduct().getDeletedAt() != null) {
                reorderWarnings.add("Product variant " + variant.getSku() + " is no longer available");
                continue;
            }
            anyValid = true;
            
            CartItem item = existingCartItems.get(variant.getId());
            if (item == null) {
                item = new CartItem();
                item.setCart(cart);
                item.setProductVariant(variant);
                item.setQuantity(Math.min(req.getQuantity(), 99)); // Max 99 items logic
                cart.addItem(item);
                cartItemRepository.save(item);
            } else {
                int newQuantity = Math.max(item.getQuantity(), req.getQuantity()); // Merge idempotency rule limit
                item.setQuantity(Math.min(newQuantity, 99));
                cartItemRepository.save(item);
            }
        }
        
        if (!anyValid) {
            throw new UnprocessableEntityException("NO_REORDERABLE_ITEMS", "All items in the past order are no longer available");
        }
        
        cartRepository.save(cart);
        return mapToResponse(cart, reorderWarnings);
    }

    private Cart getOrCreateCart(UUID customerId, byte[] guestTokenHash) {
        if (customerId != null) {
            CustomerProfile customer = customerProfileRepository.findById(customerId)
                    .orElseThrow(() -> new ResourceNotFoundException("CUSTOMER_NOT_FOUND", "Customer not found"));
            return cartRepository.findByCustomer(customer).orElseGet(() -> {
                Cart newCart = new Cart();
                newCart.setCustomer(customer);
                return cartRepository.save(newCart);
            });
        } else if (guestTokenHash != null) {
            return cartRepository.findByGuestTokenHash(guestTokenHash).orElseGet(() -> {
                Cart newCart = new Cart();
                newCart.setGuestTokenHash(guestTokenHash);
                return cartRepository.save(newCart);
            });
        }
        throw new BusinessConflictException("MISSING_IDENTIFIER", "Either customerId or guestTokenHash must be provided");
    }

    private Cart findCartOrCreatePseudo(UUID customerId, byte[] guestTokenHash) {
        if (customerId != null) {
            CustomerProfile customer = customerProfileRepository.findById(customerId)
                    .orElseThrow(() -> new ResourceNotFoundException("CUSTOMER_NOT_FOUND", "Customer not found"));
            return cartRepository.findByCustomer(customer).orElseGet(Cart::new);
        } else if (guestTokenHash != null) {
            return cartRepository.findByGuestTokenHash(guestTokenHash).orElseGet(Cart::new);
        }
        throw new BusinessConflictException("MISSING_IDENTIFIER", "Either customerId or guestTokenHash must be provided");
    }

    private CartResponse mapToResponse(Cart cart) {
        return mapToResponse(cart, new ArrayList<>());
    }

    private CartResponse mapToResponse(Cart cart, List<String> extraWarnings) {
        List<CartItemResponse> itemResponses = new ArrayList<>();
        BigDecimal grandTotal = BigDecimal.ZERO;
        List<String> warnings = extraWarnings != null ? new ArrayList<>(extraWarnings) : new ArrayList<>();

        if (cart.getId() != null && cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                ProductVariant variant = item.getProductVariant();
                BigDecimal price = variant.getSalePrice() != null ? variant.getSalePrice() : variant.getListPrice();
                BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));
                grandTotal = grandTotal.add(lineTotal);

                String statusWarning = null;
                if (!"ACTIVE".equals(variant.getProduct().getPublicationStatus().name())) {
                    statusWarning = "PRODUCT_INACTIVE";
                    warnings.add("Product " + variant.getSku() + " is no longer active");
                }

                itemResponses.add(CartItemResponse.builder()
                        .id(item.getId())
                        .productVariantId(variant.getId())
                        .productVariantName(variant.getName())
                        .sku(variant.getSku())
                        .imageUrl(null) // Should map primary image here
                        .quantity(item.getQuantity())
                        .unitPrice(price)
                        .lineTotal(lineTotal)
                        .statusWarning(statusWarning)
                        .build());
            }
        }

        return CartResponse.builder()
                .id(cart.getId())
                .items(itemResponses)
                .grandTotal(grandTotal)
                .warnings(warnings)
                .build();
    }
}
