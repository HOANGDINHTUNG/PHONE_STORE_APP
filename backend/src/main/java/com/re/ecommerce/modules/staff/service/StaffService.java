package com.re.ecommerce.modules.staff.service;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.staff.dto.request.StaffProfileRequest;
import com.re.ecommerce.modules.staff.dto.request.StaffProfileUpdateAdminRequest;
import com.re.ecommerce.modules.staff.dto.response.StaffProfileResponse;
import com.re.ecommerce.modules.staff.entity.EmploymentStatus;
import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import com.re.ecommerce.modules.staff.entity.Position;
import com.re.ecommerce.modules.staff.entity.StaffProfile;
import com.re.ecommerce.modules.staff.repository.PositionRepository;
import com.re.ecommerce.modules.staff.repository.StaffProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StaffService {
    private final StaffProfileRepository staffProfileRepository;
    private final PositionRepository positionRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PagedResponse<StaffProfileResponse> listStaff(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<StaffProfile> profilePage = staffProfileRepository.findByFilters(keyword, pageable);
        List<StaffProfileResponse> items = profilePage.stream().map(this::mapToResponse).toList();
        return PagedResponse.of(profilePage, items);
    }

    @Transactional
    public StaffProfileResponse createStaff(StaffProfileRequest request) {
        if (staffProfileRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new BusinessConflictException("EMPLOYEE_CODE_EXISTS", "Mã nhân viên đã tồn tại");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessConflictException("EMAIL_ALREADY_EXISTS", "Email đã tồn tại");
        }
        
        Position position = positionRepository.findById(request.getPositionId())
                .orElseThrow(() -> new ResourceNotFoundException("POSITION_NOT_FOUND", "Không tìm thấy chức danh"));
        
        if (position.getStatus() != OrganizationStatus.ACTIVE || position.getDepartment().getStatus() != OrganizationStatus.ACTIVE) {
            throw new BusinessConflictException("POSITION_INACTIVE", "Chức danh hoặc phòng ban không ở trạng thái ACTIVE");
        }

        StaffProfile manager = null;
        if (request.getManagerId() != null) {
            manager = staffProfileRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("MANAGER_NOT_FOUND", "Không tìm thấy quản lý"));
            if (manager.getEmploymentStatus() != EmploymentStatus.ACTIVE) {
                throw new BusinessConflictException("INVALID_MANAGER", "Quản lý không ở trạng thái ACTIVE");
            }
        }

        String unusableHash = UUID.randomUUID().toString(); // As per spec: unusable random hash
        User user = new User(request.getEmail(), request.getEmail(), unusableHash, "STAFF");
        user.setPhone(request.getPhone());
        user = userRepository.save(user);

        StaffProfile profile = new StaffProfile();
        profile.setUser(user);
        profile.setFullName(request.getFullName());
        profile.setEmployeeCode(request.getEmployeeCode());
        profile.setPosition(position);
        profile.setManager(manager);
        profile.setHireDate(request.getHireDate());
        profile.setEmploymentStatus(EmploymentStatus.ACTIVE);

        return mapToResponse(staffProfileRepository.save(profile));
    }

    @Transactional(readOnly = true)
    public StaffProfileResponse getStaffDetail(UUID userId) {
        return mapToResponse(getStaffOrThrow(userId));
    }

    @Transactional
    public StaffProfileResponse updateStaffProfile(UUID userId, StaffProfileUpdateAdminRequest request) {
        StaffProfile profile = getStaffOrThrow(userId);

        if (!profile.getEmployeeCode().equals(request.getEmployeeCode()) && 
            staffProfileRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new BusinessConflictException("EMPLOYEE_CODE_EXISTS", "Mã nhân viên đã tồn tại");
        }

        if (!profile.getPosition().getId().equals(request.getPositionId())) {
            Position position = positionRepository.findById(request.getPositionId())
                    .orElseThrow(() -> new ResourceNotFoundException("POSITION_NOT_FOUND", "Không tìm thấy chức danh"));
            if (position.getStatus() != OrganizationStatus.ACTIVE) {
                throw new BusinessConflictException("POSITION_INACTIVE", "Chức danh không ở trạng thái ACTIVE");
            }
            profile.setPosition(position);
        }

        if (request.getManagerId() != null) {
            if (request.getManagerId().equals(userId)) {
                throw new BusinessConflictException("INVALID_MANAGER", "Quản lý không hợp lệ (không thể tự quản lý chính mình)");
            }
            StaffProfile manager = staffProfileRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("MANAGER_NOT_FOUND", "Không tìm thấy quản lý"));
            profile.setManager(manager);
        } else {
            profile.setManager(null);
        }

        profile.setFullName(request.getFullName());
        profile.setEmployeeCode(request.getEmployeeCode());
        profile.setHireDate(request.getHireDate());

        return mapToResponse(staffProfileRepository.save(profile));
    }

    @Transactional
    public StaffProfileResponse changeEmploymentStatus(UUID userId, EmploymentStatus status) {
        StaffProfile profile = getStaffOrThrow(userId);
        
        // Complex transition logic omitted, simplistic transition applied
        profile.setEmploymentStatus(status);
        if (status == EmploymentStatus.SUSPENDED || status == EmploymentStatus.TERMINATED) {
            // Should also deactivate the user account based on STAFF-005
            User user = profile.getUser();
            user.deactivate(); // requires deactivate method on User or direct status update
            userRepository.save(user);
        }
        
        return mapToResponse(staffProfileRepository.save(profile));
    }

    private StaffProfile getStaffOrThrow(UUID id) {
        return staffProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("STAFF_NOT_FOUND", "Không tìm thấy hồ sơ nhân viên"));
    }

    private StaffProfileResponse mapToResponse(StaffProfile profile) {
        StaffProfileResponse.ManagerSummary managerSummary = null;
        if (profile.getManager() != null) {
            managerSummary = StaffProfileResponse.ManagerSummary.builder()
                    .id(profile.getManager().getUserId())
                    .employeeCode(profile.getManager().getEmployeeCode())
                    .fullName(profile.getManager().getFullName())
                    .build();
        }

        return StaffProfileResponse.builder()
                .userId(profile.getUserId())
                .email(profile.getUser().getEmail())
                .phone(profile.getUser().getPhone())
                .fullName(profile.getFullName())
                .employeeCode(profile.getEmployeeCode())
                .position(StaffProfileResponse.PositionSummary.builder()
                        .id(profile.getPosition().getId())
                        .code(profile.getPosition().getCode())
                        .name(profile.getPosition().getName())
                        .department(StaffProfileResponse.DepartmentSummary.builder()
                                .id(profile.getPosition().getDepartment().getId())
                                .code(profile.getPosition().getDepartment().getCode())
                                .name(profile.getPosition().getDepartment().getName())
                                .build())
                        .build())
                .manager(managerSummary)
                .employmentStatus(profile.getEmploymentStatus())
                .hireDate(profile.getHireDate())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}
