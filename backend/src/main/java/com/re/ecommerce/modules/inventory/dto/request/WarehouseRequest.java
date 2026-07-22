package com.re.ecommerce.modules.inventory.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record WarehouseRequest(
        @NotBlank(message = "Mã kho không được để trống")
        @Size(max = 30, message = "Mã kho tối đa 30 ký tự")
        String code,

        @NotBlank(message = "Tên kho không được để trống")
        @Size(max = 150, message = "Tên kho tối đa 150 ký tự")
        String name,

        @Size(max = 20, message = "Số điện thoại tối đa 20 ký tự")
        String phone,

        @Size(max = 500, message = "Địa chỉ tối đa 500 ký tự")
        String address
) {
}
