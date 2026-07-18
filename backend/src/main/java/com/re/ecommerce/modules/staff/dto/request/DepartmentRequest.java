package com.re.ecommerce.modules.staff.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DepartmentRequest {
    @NotBlank(message = "Mã phòng ban không được trống")
    @Pattern(regexp = "^[A-Z0-9_]+$", message = "Mã phòng ban chỉ chứa chữ in hoa, số và dấu gạch dưới")
    @Size(max = 50, message = "Mã phòng ban tối đa 50 ký tự")
    private String code;

    @NotBlank(message = "Tên phòng ban không được trống")
    @Size(max = 150, message = "Tên phòng ban tối đa 150 ký tự")
    private String name;
}
