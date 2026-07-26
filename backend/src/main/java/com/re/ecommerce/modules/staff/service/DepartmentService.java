package com.re.ecommerce.modules.staff.service;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.staff.dto.request.DepartmentRequest;
import com.re.ecommerce.modules.staff.dto.response.DepartmentResponse;
import com.re.ecommerce.modules.staff.entity.Department;
import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import com.re.ecommerce.modules.staff.repository.DepartmentRepository;
import com.re.ecommerce.modules.staff.repository.PositionRepository;
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
public class DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;

    @Transactional(readOnly = true)
    public PagedResponse<DepartmentResponse> listDepartments(OrganizationStatus status, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Department> departmentPage = departmentRepository.findByFilters(status, keyword, pageable);
        List<DepartmentResponse> items = departmentPage.stream().map(this::mapToResponse).toList();
        return PagedResponse.of(departmentPage, items);
    }

    @Transactional(readOnly = true)
    public DepartmentResponse getDepartment(UUID id) {
        return mapToResponse(getDepartmentOrThrow(id));
    }

    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByCode(request.getCode())) {
            throw new BusinessConflictException("DEPARTMENT_CODE_EXISTS", "Mã phòng ban đã tồn tại: " + request.getCode());
        }
        if (departmentRepository.existsByName(request.getName())) {
            throw new BusinessConflictException("DEPARTMENT_NAME_EXISTS", "Tên phòng ban đã tồn tại: " + request.getName());
        }
        Department department = new Department();
        department.setCode(request.getCode());
        department.setName(request.getName());
        department.setStatus(OrganizationStatus.ACTIVE);
        return mapToResponse(departmentRepository.save(department));
    }

    @Transactional
    public DepartmentResponse updateDepartment(UUID id, DepartmentRequest request) {
        Department department = getDepartmentOrThrow(id);
        
        if (!department.getCode().equals(request.getCode()) && departmentRepository.existsByCode(request.getCode())) {
            throw new BusinessConflictException("DEPARTMENT_CODE_EXISTS", "Mã phòng ban đã tồn tại");
        }
        if (!department.getName().equals(request.getName()) && departmentRepository.existsByName(request.getName())) {
            throw new BusinessConflictException("DEPARTMENT_NAME_EXISTS", "Tên phòng ban đã tồn tại");
        }

        department.setCode(request.getCode());
        department.setName(request.getName());
        return mapToResponse(departmentRepository.save(department));
    }

    @Transactional
    public DepartmentResponse changeStatus(UUID id, OrganizationStatus status) {
        Department department = getDepartmentOrThrow(id);
        
        if (status == OrganizationStatus.INACTIVE) {
            boolean hasActivePositions = positionRepository.existsByDepartmentIdAndStatus(id, OrganizationStatus.ACTIVE);
            if (hasActivePositions) {
                throw new BusinessConflictException("DEPARTMENT_IN_USE", "Không thể vô hiệu hóa phòng ban đang có chức danh hoạt động");
            }
        }
        
        department.setStatus(status);
        return mapToResponse(departmentRepository.save(department));
    }

    private Department getDepartmentOrThrow(UUID id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DEPARTMENT_NOT_FOUND", "Không tìm thấy phòng ban với id: " + id));
    }

    private DepartmentResponse mapToResponse(Department department) {
        return DepartmentResponse.builder()
                .id(department.getId())
                .code(department.getCode())
                .name(department.getName())
                .status(department.getStatus())
                .createdAt(department.getCreatedAt())
                .updatedAt(department.getUpdatedAt())
                .createdBy(department.getCreatedBy())
                .updatedBy(department.getUpdatedBy())
                .build();
    }
}
