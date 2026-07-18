package com.re.ecommerce.modules.staff.service;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.staff.dto.request.StaffProfileRequest;
import com.re.ecommerce.modules.staff.dto.request.StaffProfileUpdateAdminRequest;
import com.re.ecommerce.modules.staff.dto.response.StaffProfileResponse;
import com.re.ecommerce.modules.staff.entity.Department;
import com.re.ecommerce.modules.staff.entity.EmploymentStatus;
import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import com.re.ecommerce.modules.staff.entity.Position;
import com.re.ecommerce.modules.staff.entity.StaffProfile;
import com.re.ecommerce.modules.staff.repository.PositionRepository;
import com.re.ecommerce.modules.staff.repository.StaffProfileRepository;
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
public class StaffServiceTest {

    @Mock
    private StaffProfileRepository staffProfileRepository;

    @Mock
    private PositionRepository positionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private StaffService staffService;

    private UUID userId;
    private UUID positionId;
    private UUID managerId;
    
    private Position activePosition;
    private StaffProfile activeManager;
    private StaffProfile activeStaff;
    private User testUser;
    
    private StaffProfileRequest profileRequest;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        positionId = UUID.randomUUID();
        managerId = UUID.randomUUID();

        Department activeDept = new Department();
        activeDept.setStatus(OrganizationStatus.ACTIVE);
        activeDept.setCode("DEPT_A");
        activeDept.setName("Department A");
        ReflectionTestUtils.setField(activeDept, "id", UUID.randomUUID());

        activePosition = new Position();
        activePosition.setStatus(OrganizationStatus.ACTIVE);
        activePosition.setDepartment(activeDept);
        activePosition.setCode("POS_A");
        activePosition.setName("Position A");
        ReflectionTestUtils.setField(activePosition, "id", positionId);

        User managerUser = new User("manager", "manager@test.com", "hash", "STAFF");
        activeManager = new StaffProfile();
        activeManager.setEmploymentStatus(EmploymentStatus.ACTIVE);
        activeManager.setFullName("Manager Name");
        activeManager.setEmployeeCode("MGR001");
        activeManager.setUser(managerUser);
        ReflectionTestUtils.setField(activeManager, "userId", managerId);

        testUser = new User("staffuser", "staff@test.com", "hash", "STAFF");
        ReflectionTestUtils.setField(testUser, "id", userId);
        
        activeStaff = new StaffProfile();
        activeStaff.setEmploymentStatus(EmploymentStatus.ACTIVE);
        activeStaff.setFullName("Staff Name");
        activeStaff.setEmployeeCode("STF001");
        activeStaff.setPosition(activePosition);
        activeStaff.setManager(activeManager);
        activeStaff.setUser(testUser);
        ReflectionTestUtils.setField(activeStaff, "userId", userId);

        profileRequest = new StaffProfileRequest();
        profileRequest.setFullName("Test Staff");
        profileRequest.setEmail("test@test.com");
        profileRequest.setPhone("123456789");
        profileRequest.setEmployeeCode("STF002");
        profileRequest.setPositionId(positionId);
    }

    @Test
    void listStaff_shouldReturnPagedResponse() {
        Page<StaffProfile> profilePage = new PageImpl<>(List.of(activeStaff));
        when(staffProfileRepository.findByFilters(eq("STF"), any(Pageable.class)))
                .thenReturn(profilePage);

        PagedResponse<StaffProfileResponse> response = staffService.listStaff("STF", 1, 10);

        assertThat(response.getItems()).hasSize(1);
        assertThat(response.getItems().get(0).getEmployeeCode()).isEqualTo("STF001");
    }

    @Test
    void createStaff_shouldSucceed_whenDataIsUniqueAndValid() {
        when(staffProfileRepository.existsByEmployeeCode(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(positionRepository.findById(positionId)).thenReturn(Optional.of(activePosition));
        
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArgument(0);
            ReflectionTestUtils.setField(u, "id", UUID.randomUUID());
            return u;
        });
        
        when(staffProfileRepository.save(any(StaffProfile.class))).thenAnswer(i -> {
            StaffProfile sp = i.getArgument(0);
            ReflectionTestUtils.setField(sp, "userId", sp.getUser().getId());
            return sp;
        });

        StaffProfileResponse response = staffService.createStaff(profileRequest);

        assertThat(response).isNotNull();
        assertThat(response.getEmployeeCode()).isEqualTo("STF002");
        assertThat(response.getEmail()).isEqualTo("test@test.com");
    }

    @Test
    void createStaff_shouldThrow_whenEmployeeCodeExists() {
        when(staffProfileRepository.existsByEmployeeCode(anyString())).thenReturn(true);

        BusinessConflictException ex = assertThrows(BusinessConflictException.class, () -> 
                staffService.createStaff(profileRequest)
        );
        assertThat(ex.getErrorCode()).isEqualTo("EMPLOYEE_CODE_EXISTS");
    }

    @Test
    void createStaff_shouldThrow_whenPositionInactive() {
        activePosition.setStatus(OrganizationStatus.INACTIVE);
        when(staffProfileRepository.existsByEmployeeCode(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(positionRepository.findById(positionId)).thenReturn(Optional.of(activePosition));

        BusinessConflictException ex = assertThrows(BusinessConflictException.class, () -> 
                staffService.createStaff(profileRequest)
        );
        assertThat(ex.getErrorCode()).isEqualTo("POSITION_INACTIVE");
    }

    @Test
    void createStaff_shouldThrow_whenManagerInactive() {
        profileRequest.setManagerId(managerId);
        activeManager.setEmploymentStatus(EmploymentStatus.TERMINATED);
        
        when(staffProfileRepository.existsByEmployeeCode(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(positionRepository.findById(positionId)).thenReturn(Optional.of(activePosition));
        when(staffProfileRepository.findById(managerId)).thenReturn(Optional.of(activeManager));

        BusinessConflictException ex = assertThrows(BusinessConflictException.class, () -> 
                staffService.createStaff(profileRequest)
        );
        assertThat(ex.getErrorCode()).isEqualTo("INVALID_MANAGER");
    }

    @Test
    void updateStaffProfile_shouldThrow_whenSelfAssignedAsManager() {
        StaffProfileUpdateAdminRequest updateReq = new StaffProfileUpdateAdminRequest();
        updateReq.setManagerId(userId); // Self assigning
        updateReq.setEmployeeCode("STF001");
        updateReq.setPositionId(positionId);

        when(staffProfileRepository.findById(userId)).thenReturn(Optional.of(activeStaff));

        BusinessConflictException ex = assertThrows(BusinessConflictException.class, () -> 
                staffService.updateStaffProfile(userId, updateReq)
        );
        assertThat(ex.getErrorCode()).isEqualTo("INVALID_MANAGER");
    }

    @Test
    void changeEmploymentStatus_shouldSuspendAndDeactivateUser_whenSuspended() {
        when(staffProfileRepository.findById(userId)).thenReturn(Optional.of(activeStaff));
        when(staffProfileRepository.save(any(StaffProfile.class))).thenReturn(activeStaff);

        StaffProfileResponse response = staffService.changeEmploymentStatus(userId, EmploymentStatus.SUSPENDED);

        assertThat(response.getEmploymentStatus()).isEqualTo(EmploymentStatus.SUSPENDED);
        verify(userRepository, times(1)).save(any(User.class)); // Verifies the user was saved after being deactivated
        assertThat(testUser.isActive()).isFalse(); // Verifies user deactivated flag
    }

    @Test
    void updateStaffProfile_shouldSucceed() {
        StaffProfileUpdateAdminRequest updateReq = new StaffProfileUpdateAdminRequest();
        updateReq.setFullName("Updated Name");
        updateReq.setEmployeeCode("STF001");
        updateReq.setPositionId(positionId);
        updateReq.setManagerId(null);
        when(staffProfileRepository.findById(userId)).thenReturn(Optional.of(activeStaff));
        when(staffProfileRepository.save(any(StaffProfile.class))).thenReturn(activeStaff);

        StaffProfileResponse response = staffService.updateStaffProfile(userId, updateReq);
        assertThat(response).isNotNull();
    }
    
    @Test
    void updateStaffProfile_shouldThrow_whenEmployeeCodeExists() {
        StaffProfileUpdateAdminRequest updateReq = new StaffProfileUpdateAdminRequest();
        updateReq.setEmployeeCode("STF002");
        when(staffProfileRepository.findById(userId)).thenReturn(Optional.of(activeStaff));
        when(staffProfileRepository.existsByEmployeeCode("STF002")).thenReturn(true);

        BusinessConflictException ex = assertThrows(BusinessConflictException.class, () -> 
                staffService.updateStaffProfile(userId, updateReq)
        );
        assertThat(ex.getErrorCode()).isEqualTo("EMPLOYEE_CODE_EXISTS");
    }

    @Test
    void updateStaffProfile_shouldThrow_whenPositionInactive() {
        StaffProfileUpdateAdminRequest updateReq = new StaffProfileUpdateAdminRequest();
        updateReq.setEmployeeCode("STF001");
        updateReq.setPositionId(UUID.randomUUID());
        Position inactivePosition = new Position();
        inactivePosition.setStatus(OrganizationStatus.INACTIVE);
        when(staffProfileRepository.findById(userId)).thenReturn(Optional.of(activeStaff));
        when(positionRepository.findById(updateReq.getPositionId())).thenReturn(Optional.of(inactivePosition));

        BusinessConflictException ex = assertThrows(BusinessConflictException.class, () -> 
                staffService.updateStaffProfile(userId, updateReq)
        );
        assertThat(ex.getErrorCode()).isEqualTo("POSITION_INACTIVE");
    }
    
    @Test
    void updateStaffProfile_shouldThrow_whenPositionNotFound() {
        StaffProfileUpdateAdminRequest updateReq = new StaffProfileUpdateAdminRequest();
        updateReq.setEmployeeCode("STF001");
        updateReq.setPositionId(UUID.randomUUID());
        when(staffProfileRepository.findById(userId)).thenReturn(Optional.of(activeStaff));
        when(positionRepository.findById(updateReq.getPositionId())).thenReturn(Optional.empty());

        com.re.ecommerce.common.exception.ResourceNotFoundException ex = assertThrows(com.re.ecommerce.common.exception.ResourceNotFoundException.class, () -> 
                staffService.updateStaffProfile(userId, updateReq)
        );
        assertThat(ex.getErrorCode()).isEqualTo("POSITION_NOT_FOUND");
    }

    @Test
    void updateStaffProfile_shouldThrow_whenManagerNotFound() {
        StaffProfileUpdateAdminRequest updateReq = new StaffProfileUpdateAdminRequest();
        updateReq.setEmployeeCode("STF001");
        updateReq.setPositionId(positionId);
        updateReq.setManagerId(UUID.randomUUID());
        when(staffProfileRepository.findById(userId)).thenReturn(Optional.of(activeStaff));
        when(staffProfileRepository.findById(updateReq.getManagerId())).thenReturn(Optional.empty());

        com.re.ecommerce.common.exception.ResourceNotFoundException ex = assertThrows(com.re.ecommerce.common.exception.ResourceNotFoundException.class, () -> 
                staffService.updateStaffProfile(userId, updateReq)
        );
        assertThat(ex.getErrorCode()).isEqualTo("MANAGER_NOT_FOUND");
    }

    @Test
    void changeEmploymentStatus_shouldSucceed_whenActive() {
        when(staffProfileRepository.findById(userId)).thenReturn(Optional.of(activeStaff));
        when(staffProfileRepository.save(any(StaffProfile.class))).thenReturn(activeStaff);

        StaffProfileResponse response = staffService.changeEmploymentStatus(userId, EmploymentStatus.ACTIVE);
        assertThat(response.getEmploymentStatus()).isEqualTo(EmploymentStatus.ACTIVE);
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    void getStaffDetail_shouldSucceed() {
        when(staffProfileRepository.findById(userId)).thenReturn(Optional.of(activeStaff));
        StaffProfileResponse response = staffService.getStaffDetail(userId);
        assertThat(response).isNotNull();
        assertThat(response.getUserId()).isEqualTo(userId);
    }
}
