package com.re.ecommerce.modules.staff.service;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.staff.dto.request.PositionRequest;
import com.re.ecommerce.modules.staff.dto.response.PositionResponse;
import com.re.ecommerce.modules.staff.entity.Department;
import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import com.re.ecommerce.modules.staff.entity.Position;
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
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PositionServiceTest {

    @Mock
    private PositionRepository positionRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private PositionService positionService;

    private Department activeDepartment;
    private Department inactiveDepartment;
    private Position activePosition;
    private PositionRequest positionRequest;
    private UUID deptId;
    private UUID posId;

    @BeforeEach
    void setUp() {
        deptId = UUID.randomUUID();
        posId = UUID.randomUUID();

        activeDepartment = new Department();
        ReflectionTestUtils.setField(activeDepartment, "id", deptId);
        activeDepartment.setCode("IT");
        activeDepartment.setName("Information Technology");
        activeDepartment.setStatus(OrganizationStatus.ACTIVE);

        inactiveDepartment = new Department();
        ReflectionTestUtils.setField(inactiveDepartment, "id", UUID.randomUUID());
        inactiveDepartment.setStatus(OrganizationStatus.INACTIVE);

        activePosition = new Position();
        ReflectionTestUtils.setField(activePosition, "id", posId);
        activePosition.setCode("DEV");
        activePosition.setName("Developer");
        activePosition.setDepartment(activeDepartment);
        activePosition.setStatus(OrganizationStatus.ACTIVE);

        positionRequest = new PositionRequest();
        positionRequest.setCode("DEV_LEAD");
        positionRequest.setName("Developer Lead");
        positionRequest.setDepartmentId(deptId);
    }

    @Test
    void listPositions_shouldReturnPagedResponse() {
        Page<Position> positionPage = new PageImpl<>(List.of(activePosition));
        when(positionRepository.findByFilters(eq(deptId), eq(OrganizationStatus.ACTIVE), eq("DEV"), any(Pageable.class)))
                .thenReturn(positionPage);

        PagedResponse<PositionResponse> response = positionService.listPositions(deptId, OrganizationStatus.ACTIVE, "DEV", 1, 10);

        assertThat(response.getItems()).hasSize(1);
        assertThat(response.getItems().get(0).getCode()).isEqualTo("DEV");
    }

    @Test
    void createPosition_shouldSucceed_whenDepartmentActiveAndCodeUnique() {
        when(departmentRepository.findById(deptId)).thenReturn(Optional.of(activeDepartment));
        when(positionRepository.existsByCode("DEV_LEAD")).thenReturn(false);
        when(positionRepository.save(any(Position.class))).thenAnswer(i -> {
            Position p = i.getArgument(0);
            ReflectionTestUtils.setField(p, "id", UUID.randomUUID());
            return p;
        });

        PositionResponse response = positionService.createPosition(positionRequest);

        assertThat(response).isNotNull();
        assertThat(response.getCode()).isEqualTo("DEV_LEAD");
        assertThat(response.getStatus()).isEqualTo(OrganizationStatus.ACTIVE);
    }

    @Test
    void createPosition_shouldThrow_whenDepartmentNotFound() {
        when(departmentRepository.findById(deptId)).thenReturn(Optional.empty());

        ResourceNotFoundException ex = assertThrows(ResourceNotFoundException.class, () -> 
            positionService.createPosition(positionRequest)
        );
        assertThat(ex.getErrorCode()).isEqualTo("DEPARTMENT_NOT_FOUND");
    }

    @Test
    void createPosition_shouldThrow_whenDepartmentIsInActive() {
        positionRequest = new PositionRequest();
        positionRequest.setCode("DEV_LEAD");
        positionRequest.setName("Lead");
        positionRequest.setDepartmentId(inactiveDepartment.getId());
        when(departmentRepository.findById(inactiveDepartment.getId())).thenReturn(Optional.of(inactiveDepartment));

        BusinessConflictException ex = assertThrows(BusinessConflictException.class, () -> 
            positionService.createPosition(positionRequest)
        );
        assertThat(ex.getErrorCode()).isEqualTo("DEPARTMENT_INACTIVE");
    }

    @Test
    void createPosition_shouldThrow_whenCodeExists() {
        when(departmentRepository.findById(deptId)).thenReturn(Optional.of(activeDepartment));
        when(positionRepository.existsByCode("DEV_LEAD")).thenReturn(true);

        BusinessConflictException ex = assertThrows(BusinessConflictException.class, () -> 
            positionService.createPosition(positionRequest)
        );
        assertThat(ex.getErrorCode()).isEqualTo("POSITION_CODE_EXISTS");
    }

    @Test
    void updatePosition_shouldThrow_whenCodeExistsForDifferentPosition() {
        when(positionRepository.findById(posId)).thenReturn(Optional.of(activePosition));
        // Changing to a new code that exists
        positionRequest = new PositionRequest();
        positionRequest.setCode("EXISTING_CODE");
        positionRequest.setName("Test");
        positionRequest.setDepartmentId(deptId);
        when(positionRepository.existsByCode("EXISTING_CODE")).thenReturn(true);

        BusinessConflictException ex = assertThrows(BusinessConflictException.class, () -> 
            positionService.updatePosition(posId, positionRequest)
        );
        assertThat(ex.getErrorCode()).isEqualTo("POSITION_CODE_EXISTS");
    }

    @Test
    void updatePosition_shouldAllowSameCodeUpdate() {
        when(positionRepository.findById(posId)).thenReturn(Optional.of(activePosition));
        positionRequest = new PositionRequest();
        positionRequest.setCode("DEV");
        positionRequest.setName("Lead Developer");
        positionRequest.setDepartmentId(deptId);
        // existsByCode shouldn't be called because the code didn't change
        when(positionRepository.save(any(Position.class))).thenReturn(activePosition);
        activePosition.setName("Lead Developer"); // simulate save effect

        PositionResponse response = positionService.updatePosition(posId, positionRequest);

        assertThat(response.getName()).isEqualTo("Lead Developer");
        verify(positionRepository, never()).existsByCode(anyString());
    }

    @Test
    void changeStatus_shouldThrow_whenSettingActiveButDeptInactive() {
        activePosition.setDepartment(inactiveDepartment);
        activePosition.setStatus(OrganizationStatus.INACTIVE);
        when(positionRepository.findById(posId)).thenReturn(Optional.of(activePosition));

        BusinessConflictException ex = assertThrows(BusinessConflictException.class, () -> 
            positionService.changeStatus(posId, OrganizationStatus.ACTIVE)
        );
        assertThat(ex.getErrorCode()).isEqualTo("DEPARTMENT_INACTIVE");
    }

    @Test
    void changeStatus_shouldSucceed_whenSwitchingToInactive() {
        when(positionRepository.findById(posId)).thenReturn(Optional.of(activePosition));
        when(positionRepository.save(any(Position.class))).thenReturn(activePosition);

        PositionResponse response = positionService.changeStatus(posId, OrganizationStatus.INACTIVE);

        assertThat(response.getStatus()).isEqualTo(OrganizationStatus.INACTIVE);
    }
}
