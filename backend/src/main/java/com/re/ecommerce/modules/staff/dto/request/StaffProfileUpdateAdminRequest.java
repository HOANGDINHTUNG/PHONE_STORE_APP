package com.re.ecommerce.modules.staff.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class StaffProfileUpdateAdminRequest {
    @NotBlank(message = "Họ tên không được trống")
    @Size(max = 150, message = "Họ tên tối đa 150 ký tự")
    private String fullName;

    @NotBlank(message = "Mã nhân viên không được trống")
    @Size(max = 50)
    private String employeeCode;

    @NotNull(message = "ID chức danh không được trống")
    private UUID positionId;

    private UUID managerId;

    private LocalDate hireDate;
}
