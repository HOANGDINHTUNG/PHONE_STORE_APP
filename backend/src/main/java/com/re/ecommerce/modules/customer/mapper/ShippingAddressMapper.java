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
    public void updateAddressFromRequest(com.re.ecommerce.modules.customer.dto.request.AddressUpdateRequest request, ShippingAddress address) {
        if (org.springframework.util.StringUtils.hasText(request.receiverName())) address.setReceiverName(request.receiverName());
        if (org.springframework.util.StringUtils.hasText(request.receiverPhone())) address.setReceiverPhone(request.receiverPhone());
        if (org.springframework.util.StringUtils.hasText(request.countryCode())) address.setCountryCode(request.countryCode());
        if (org.springframework.util.StringUtils.hasText(request.provinceCode())) address.setProvinceCode(request.provinceCode());
        if (org.springframework.util.StringUtils.hasText(request.provinceName())) address.setProvinceName(request.provinceName());
        if (org.springframework.util.StringUtils.hasText(request.districtCode())) address.setDistrictCode(request.districtCode());
        if (org.springframework.util.StringUtils.hasText(request.districtName())) address.setDistrictName(request.districtName());
        if (org.springframework.util.StringUtils.hasText(request.wardCode())) address.setWardCode(request.wardCode());
        if (org.springframework.util.StringUtils.hasText(request.wardName())) address.setWardName(request.wardName());
        if (org.springframework.util.StringUtils.hasText(request.detailAddress())) address.setDetailAddress(request.detailAddress());
        if (org.springframework.util.StringUtils.hasText(request.postalCode())) address.setPostalCode(request.postalCode());
    }
}
