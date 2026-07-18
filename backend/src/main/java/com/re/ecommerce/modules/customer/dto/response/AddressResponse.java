package com.re.ecommerce.modules.customer.dto.response;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record AddressResponse(
        UUID id,
        String receiverName,
        String receiverPhone,
        String countryCode,
        String provinceCode,
        String provinceName,
        String districtCode,
        String districtName,
        String wardCode,
        String wardName,
        String detailAddress,
        String postalCode,
        boolean isDefault,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
