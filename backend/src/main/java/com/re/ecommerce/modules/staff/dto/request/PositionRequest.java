package com.re.ecommerce.modules.staff.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.UUID;

@Data
public class PositionRequest {
    @NotNull(message = "ID phòng ban không được trống")
    private UUID departmentId;

    @NotBlank(message = "Mã chức danh không được trống")
    @Pattern(regexp = "^[A-Z0-9_]+$", message = "Mã chức danh chỉ chứa chữ in hoa, số và dấu gạch dưới")
    @Size(max = 50, message = "Mã chức danh tối đa 50 ký tự")
    private String code;

    @NotBlank(message = "Tên chức danh không được trống")
    @Size(max = 150, message = "Tên chức danh tối đa 150 ký tự")
    private String name;
}
