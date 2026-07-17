package com.re.ecommerce.modules.catalog.dto.request;

import com.re.ecommerce.modules.catalog.entity.CategoryStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CategoryRequest(
        @NotBlank(message = "Tên danh mục không được để trống")
        @Size(min = 2, max = 150, message = "Tên danh mục phải có độ dài từ 2 đến 150 ký tự")
        String name,
        
        UUID parentId,
        
        String description,
        
        CategoryStatus status,
        
        @Min(value = 0, message = "Thứ tự sắp xếp phải lớn hơn hoặc bằng 0")
        int sortOrder
) {}
