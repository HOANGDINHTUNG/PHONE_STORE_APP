package com.re.ecommerce.modules.customer.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AddressCreateRequest(
        @NotBlank(message = "Tên người nhận không được để trống")
        @Size(max = 150, message = "Tên người nhận không được vượt quá 150 ký tự")
        String receiverName,

        @NotBlank(message = "Số điện thoại không được để trống")
        @Size(max = 20, message = "Số điện thoại không được vượt quá 20 ký tự")
        String receiverPhone,

        @Size(max = 2, message = "Mã quốc gia không được vượt quá 2 ký tự")
        String countryCode,

        @Size(max = 20, message = "Mã tỉnh thành không được vượt quá 20 ký tự")
        String provinceCode,

        @NotBlank(message = "Tên tỉnh thành không được để trống")
        @Size(max = 100, message = "Tên tỉnh thành không được vượt quá 100 ký tự")
        String provinceName,

        @Size(max = 20, message = "Mã quận huyện không được vượt quá 20 ký tự")
        String districtCode,

        @NotBlank(message = "Tên quận huyện không được để trống")
        @Size(max = 100, message = "Tên quận huyện không được vượt quá 100 ký tự")
        String districtName,

        @Size(max = 20, message = "Mã phường xã không được vượt quá 20 ký tự")
        String wardCode,

        @NotBlank(message = "Tên phường xã không được để trống")
        @Size(max = 100, message = "Tên phường xã không được vượt quá 100 ký tự")
        String wardName,

        @NotBlank(message = "Địa chỉ chi tiết không được để trống")
        @Size(max = 255, message = "Địa chỉ chi tiết không được vượt quá 255 ký tự")
        String detailAddress,

        @Size(max = 20, message = "Mã bưu chính không được vượt quá 20 ký tự")
        String postalCode,

        boolean isDefault
) {}
