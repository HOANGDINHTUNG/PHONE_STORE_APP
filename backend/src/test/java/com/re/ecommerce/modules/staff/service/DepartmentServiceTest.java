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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DepartmentServiceTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private PositionRepository positionRepository;

    @InjectMocks
    private DepartmentService departmentService;

    private Department department;
    private DepartmentRequest request;
    private final UUID deptId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        department = new Department();
        department.setId(deptId);
        department.setCode("DEPT1");
        department.setName("Department 1");
        department.setStatus(OrganizationStatus.ACTIVE);

        request = new DepartmentRequest();
        request.setCode("DEPT1");
        request.setName("Department 1");
    }

    @Test
    void listDepartments_Success() {
        Page<Department> page = new PageImpl<>(List.of(department));
        when(departmentRepository.findByFilters(any(), any(), any(Pageable.class))).thenReturn(page);

        PagedResponse<DepartmentResponse> res = departmentService.listDepartments(OrganizationStatus.ACTIVE, "keyword", 1, 10);
        
        assertNotNull(res);
        assertEquals(1, res.getItems().size());
        assertEquals("DEPT1", res.getItems().get(0).getCode());
    }

    @Test
    void createDepartment_Success() {
        when(departmentRepository.existsByCode(anyString())).thenReturn(false);
        when(departmentRepository.existsByName(anyString())).thenReturn(false);
        when(departmentRepository.save(any(Department.class))).thenReturn(department);

        DepartmentResponse res = departmentService.createDepartment(request);
        assertNotNull(res);
        assertEquals("DEPT1", res.getCode());
    }

    @Test
    void createDepartment_CodeExists_ThrowsException() {
        when(departmentRepository.existsByCode(anyString())).thenReturn(true);
        assertThrows(BusinessConflictException.class, () -> departmentService.createDepartment(request));
    }

    @Test
    void createDepartment_NameExists_ThrowsException() {
        when(departmentRepository.existsByCode(anyString())).thenReturn(false);
        when(departmentRepository.existsByName(anyString())).thenReturn(true);
        assertThrows(BusinessConflictException.class, () -> departmentService.createDepartment(request));
    }

    @Test
    void updateDepartment_Success() {
        when(departmentRepository.findById(deptId)).thenReturn(Optional.of(department));
        when(departmentRepository.save(any(Department.class))).thenReturn(department);

        DepartmentResponse res = departmentService.updateDepartment(deptId, request);
        assertNotNull(res);
        assertEquals("DEPT1", res.getCode());
    }

    @Test
    void updateDepartment_NotFound_ThrowsException() {
        when(departmentRepository.findById(deptId)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> departmentService.updateDepartment(deptId, request));
    }

    @Test
    void updateDepartment_NewCodeExists_ThrowsException() {
        DepartmentRequest newReq = new DepartmentRequest();
        newReq.setCode("DEPT2");
        newReq.setName("Department 1");

        when(departmentRepository.findById(deptId)).thenReturn(Optional.of(department));
        when(departmentRepository.existsByCode("DEPT2")).thenReturn(true);

        assertThrows(BusinessConflictException.class, () -> departmentService.updateDepartment(deptId, newReq));
    }

    @Test
    void updateDepartment_NewNameExists_ThrowsException() {
        DepartmentRequest newReq = new DepartmentRequest();
        newReq.setCode("DEPT1");
        newReq.setName("Department 2");

        when(departmentRepository.findById(deptId)).thenReturn(Optional.of(department));
        when(departmentRepository.existsByName("Department 2")).thenReturn(true);

        assertThrows(BusinessConflictException.class, () -> departmentService.updateDepartment(deptId, newReq));
    }

    @Test
    void changeStatus_Success() {
        when(departmentRepository.findById(deptId)).thenReturn(Optional.of(department));
        when(positionRepository.existsByDepartmentIdAndStatus(deptId, OrganizationStatus.ACTIVE)).thenReturn(false);
        when(departmentRepository.save(any(Department.class))).thenReturn(department);

        DepartmentResponse res = departmentService.changeStatus(deptId, OrganizationStatus.INACTIVE);
        assertNotNull(res);
    }
    
    @Test
    void changeStatus_Active_Success() {
        when(departmentRepository.findById(deptId)).thenReturn(Optional.of(department));
        when(departmentRepository.save(any(Department.class))).thenReturn(department);

        DepartmentResponse res = departmentService.changeStatus(deptId, OrganizationStatus.ACTIVE);
        assertNotNull(res);
    }

    @Test
    void changeStatus_InUse_ThrowsException() {
        when(departmentRepository.findById(deptId)).thenReturn(Optional.of(department));
        when(positionRepository.existsByDepartmentIdAndStatus(deptId, OrganizationStatus.ACTIVE)).thenReturn(true);

        assertThrows(BusinessConflictException.class, () -> departmentService.changeStatus(deptId, OrganizationStatus.INACTIVE));
    }
}
