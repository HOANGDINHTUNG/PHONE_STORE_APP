package com.re.ecommerce.modules.customer.service;

import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.auth.entity.CustomerProfile;
import com.re.ecommerce.modules.auth.repository.CustomerProfileRepository;
import com.re.ecommerce.modules.customer.dto.request.AddressCreateRequest;
import com.re.ecommerce.modules.customer.dto.request.AddressUpdateRequest;
import com.re.ecommerce.modules.customer.dto.response.AddressResponse;
import com.re.ecommerce.modules.customer.entity.ShippingAddress;
import com.re.ecommerce.modules.customer.mapper.ShippingAddressMapper;
import com.re.ecommerce.modules.customer.repository.ShippingAddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShippingAddressService {

    private final ShippingAddressRepository addressRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final com.re.ecommerce.modules.auth.repository.UserRepository userRepository;
    private final ShippingAddressMapper mapper;

    @Transactional(readOnly = true)
    public List<AddressResponse> listAddresses(String username) {
        UUID customerId = getUserIdOrThrow(username);
        return addressRepository.findActiveByCustomerId(customerId).stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AddressResponse getAddress(UUID addressId, String username) {
        UUID customerId = getUserIdOrThrow(username);
        ShippingAddress address = getActiveAddressOrThrow(addressId, customerId);
        return mapper.toResponse(address);
    }

    @Transactional
    public AddressResponse createAddress(String username, AddressCreateRequest request) {
        UUID customerId = getUserIdOrThrow(username);
        CustomerProfile customer = customerProfileRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("CUSTOMER_NOT_FOUND", "Customer profile not found"));

        long activeCount = addressRepository.countActiveByCustomerId(customerId);
        boolean shouldBeDefault = request.isDefault() || activeCount == 0;

        if (shouldBeDefault && activeCount > 0) {
            addressRepository.clearDefaultByCustomerId(customerId);
        }

        ShippingAddress address = new ShippingAddress(
                customer,
                request.receiverName(),
                request.receiverPhone(),
                request.provinceName(),
                request.districtName(),
                request.wardName(),
                request.detailAddress()
        );
        
        address.setCountryCode(StringUtils.hasText(request.countryCode()) ? request.countryCode() : "VN");
        address.setProvinceCode(request.provinceCode());
        address.setDistrictCode(request.districtCode());
        address.setWardCode(request.wardCode());
        address.setPostalCode(request.postalCode());
        address.setDefault(shouldBeDefault);

        return mapper.toResponse(addressRepository.save(address));
    }

    @Transactional
    public AddressResponse updateAddress(UUID addressId, String username, AddressUpdateRequest request) {
        UUID customerId = getUserIdOrThrow(username);
        ShippingAddress address = getActiveAddressOrThrow(addressId, customerId);

        if (StringUtils.hasText(request.receiverName())) address.setReceiverName(request.receiverName());
        if (StringUtils.hasText(request.receiverPhone())) address.setReceiverPhone(request.receiverPhone());
        if (StringUtils.hasText(request.countryCode())) address.setCountryCode(request.countryCode());
        if (StringUtils.hasText(request.provinceCode())) address.setProvinceCode(request.provinceCode());
        if (StringUtils.hasText(request.provinceName())) address.setProvinceName(request.provinceName());
        if (StringUtils.hasText(request.districtCode())) address.setDistrictCode(request.districtCode());
        if (StringUtils.hasText(request.districtName())) address.setDistrictName(request.districtName());
        if (StringUtils.hasText(request.wardCode())) address.setWardCode(request.wardCode());
        if (StringUtils.hasText(request.wardName())) address.setWardName(request.wardName());
        if (StringUtils.hasText(request.detailAddress())) address.setDetailAddress(request.detailAddress());
        if (StringUtils.hasText(request.postalCode())) address.setPostalCode(request.postalCode());

        if (request.isDefault() != null && request.isDefault() && !address.isDefault()) {
            addressRepository.clearDefaultByCustomerId(customerId);
            address.setDefault(true);
        }

        return mapper.toResponse(addressRepository.save(address));
    }

    @Transactional
    public void setDefaultAddress(UUID addressId, String username) {
        UUID customerId = getUserIdOrThrow(username);
        ShippingAddress address = getActiveAddressOrThrow(addressId, customerId);
        if (!address.isDefault()) {
            addressRepository.clearDefaultByCustomerId(customerId);
            address.setDefault(true);
            addressRepository.save(address);
        }
    }

    @Transactional
    public void deleteAddress(UUID addressId, String username) {
        UUID customerId = getUserIdOrThrow(username);
        ShippingAddress address = getActiveAddressOrThrow(addressId, customerId);

        address.setDeletedAt(LocalDateTime.now());
        boolean wasDefault = address.isDefault();
        address.setDefault(false);
        addressRepository.save(address);

        if (wasDefault) {
            // Find another active address to set as default (the next implicitly newest active address)
            addressRepository.findActiveByCustomerId(customerId).stream()
                    .filter(a -> !a.getId().equals(address.getId()))
                    .findFirst()
                    .ifPresent(newDefault -> {
                        newDefault.setDefault(true);
                        addressRepository.save(newDefault);
                    });
        }
    }

    private ShippingAddress getActiveAddressOrThrow(UUID id, UUID customerId) {
        return addressRepository.findActiveByIdAndCustomerId(id, customerId)
                .orElseThrow(() -> new ResourceNotFoundException("ADDRESS_NOT_FOUND", "Shipping address not found or you don't have permission"));
    }

    private UUID getUserIdOrThrow(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND", "User not found"))
                .getId();
    }
}
