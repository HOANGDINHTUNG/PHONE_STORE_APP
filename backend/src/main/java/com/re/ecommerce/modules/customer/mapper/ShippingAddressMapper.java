package com.re.ecommerce.modules.customer.mapper;

import com.re.ecommerce.modules.customer.dto.response.AddressResponse;
import com.re.ecommerce.modules.customer.entity.ShippingAddress;
import org.springframework.stereotype.Component;

@Component
public class ShippingAddressMapper {

    public AddressResponse toResponse(ShippingAddress entity) {
        if (entity == null) {
            return null;
        }
        return AddressResponse.builder()
                .id(entity.getId())
                .receiverName(entity.getReceiverName())
                .receiverPhone(entity.getReceiverPhone())
                .countryCode(entity.getCountryCode())
                .provinceCode(entity.getProvinceCode())
                .provinceName(entity.getProvinceName())
                .districtCode(entity.getDistrictCode())
                .districtName(entity.getDistrictName())
                .wardCode(entity.getWardCode())
                .wardName(entity.getWardName())
                .detailAddress(entity.getDetailAddress())
                .postalCode(entity.getPostalCode())
                .isDefault(entity.isDefault())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
