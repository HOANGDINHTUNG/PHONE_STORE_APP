package com.re.ecommerce.modules.staff.dto.response;

import com.re.ecommerce.modules.staff.entity.EmploymentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class StaffProfileResponse {
    private UUID userId;
    private String email;
    private String phone;
    private String fullName;
    private String employeeCode;
    private PositionSummary position;
    private ManagerSummary manager;
    private EmploymentStatus employmentStatus;
    private LocalDate hireDate;
    private Instant createdAt;
    private Instant updatedAt;

    @Data
    @Builder
    public static class PositionSummary {
        private UUID id;
        private String code;
        private String name;
        private DepartmentSummary department;
    }

    @Data
    @Builder
    public static class DepartmentSummary {
        private UUID id;
        private String code;
        private String name;
    }

    @Data
    @Builder
    public static class ManagerSummary {
        private UUID id;
        private String employeeCode;
        private String fullName;
    }
}
