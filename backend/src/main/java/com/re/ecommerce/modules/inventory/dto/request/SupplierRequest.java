package com.re.ecommerce.modules.inventory.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SupplierRequest(
        @NotBlank(message = "Mã nhà cung cấp không được để trống")
        @Size(max = 30, message = "Mã NCC tối đa 30 ký tự")
        String supplierCode,

        @NotBlank(message = "Tên nhà cung cấp không được để trống")
        @Size(max = 255, message = "Tên NCC tối đa 255 ký tự")
        String name,

        @Size(max = 50, message = "Mã số thuế tối đa 50 ký tự")
        String taxCode,

        @Size(max = 150, message = "Tên liên hệ tối đa 150 ký tự")
        String contactName,

        @Size(max = 20, message = "Số điện thoại tối đa 20 ký tự")
        String phone,

        @Email(message = "Email không hợp lệ")
        @Size(max = 254, message = "Email tối đa 254 ký tự")
        String email,

        @Size(max = 500, message = "Địa chỉ tối đa 500 ký tự")
        String address
) {
}
