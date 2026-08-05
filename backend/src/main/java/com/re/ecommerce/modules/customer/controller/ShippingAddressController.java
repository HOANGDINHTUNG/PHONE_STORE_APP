package com.re.ecommerce.modules.customer.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.re.ecommerce.modules.customer.dto.request.AddressCreateRequest;
import com.re.ecommerce.modules.customer.dto.request.AddressUpdateRequest;
import com.re.ecommerce.modules.customer.dto.response.AddressResponse;
import com.re.ecommerce.modules.customer.service.ShippingAddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "10. Shipping Address")
@RestController
@RequestMapping("/api/v1/me/shipping-addresses")
@RequiredArgsConstructor
@Slf4j
public class ShippingAddressController {

    private final ShippingAddressService addressService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AddressResponse>> listAddresses(
            @AuthenticationPrincipal String username) {

        return ResponseEntity.ok(addressService.listAddresses(username));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressResponse> createAddress(
            @AuthenticationPrincipal String username,
            @Valid @RequestBody AddressCreateRequest request) {

        AddressResponse response = addressService.createAddress(username, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressResponse> getAddress(
            @PathVariable UUID id,
            @AuthenticationPrincipal String username) {

        return ResponseEntity.ok(addressService.getAddress(id, username));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable UUID id,
            @AuthenticationPrincipal String username,
            @Valid @RequestBody AddressUpdateRequest request) {

        return ResponseEntity.ok(addressService.updateAddress(id, username, request));
    }

    @PostMapping("/{id}/set-default")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> setDefaultAddress(
            @PathVariable UUID id,
            @AuthenticationPrincipal String username) {

        addressService.setDefaultAddress(id, username);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable UUID id,
            @AuthenticationPrincipal String username) {

        addressService.deleteAddress(id, username);
        return ResponseEntity.noContent().build();
    }
}
