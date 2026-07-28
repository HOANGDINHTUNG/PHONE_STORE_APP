package com.re.ecommerce.modules.customer.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.modules.customer.dto.response.WishlistItemResponse;
import com.re.ecommerce.modules.customer.service.WishlistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.re.ecommerce.security.CustomUserDetails;
import com.re.ecommerce.modules.customer.dto.request.WishlistAddRequest;

import java.util.UUID;

@Tag(name = "11. Wishlist")
@RestController
@RequestMapping("/api/v1/me/wishlist-items")
@RequiredArgsConstructor
@Slf4j
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<PagedResponse<WishlistItemResponse>> listWishlist(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(wishlistService.listWishlist(userDetails.getUsername(), page, size));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<Void> addProductToWishlist(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody WishlistAddRequest req) {
        wishlistService.addProductToWishlist(userDetails.getUsername(), req.productId());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{productId}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<Void> removeProductFromWishlist(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable UUID productId) {
        wishlistService.removeProductFromWishlist(userDetails.getUsername(), productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<Void> clearWishlist(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        wishlistService.clearWishlist(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
