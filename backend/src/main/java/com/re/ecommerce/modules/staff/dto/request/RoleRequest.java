package com.re.ecommerce.modules.staff.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RoleRequest {
    @NotBlank(message = "Mã role không được trống")
    @Pattern(regexp = "^[A-Z0-9_]+$", message = "Mã role chỉ chứa chữ in hoa, số và dấu gạch dưới")
    @Size(max = 50)
    private String code;

    @NotBlank(message = "Tên role không được trống")
    @Size(max = 150)
    private String name;

    @Size(max = 500)
    private String description;
}
