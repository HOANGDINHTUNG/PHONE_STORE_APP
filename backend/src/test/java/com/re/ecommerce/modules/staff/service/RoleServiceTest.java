package com.re.ecommerce.modules.staff.service;

import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.staff.dto.request.RoleRequest;
import com.re.ecommerce.modules.staff.dto.request.UserRoleRequest;
import com.re.ecommerce.modules.staff.dto.response.RoleResponse;
import com.re.ecommerce.modules.staff.dto.response.UserRoleResponse;
import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import com.re.ecommerce.modules.staff.entity.Permission;
import com.re.ecommerce.modules.staff.entity.Role;
import com.re.ecommerce.modules.staff.entity.UserRole;
import com.re.ecommerce.modules.staff.repository.PermissionRepository;
import com.re.ecommerce.modules.staff.repository.RoleRepository;
import com.re.ecommerce.modules.staff.repository.UserRoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RoleServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PermissionRepository permissionRepository;
    
    @Mock
    private UserRoleRepository userRoleRepository;
    
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RoleService roleService;

    private UUID roleId;
    private UUID systemRoleId;
    private UUID userId;
    private UUID permId;
    
    private Role customRole;
    private Role systemRole;
    private User user;
    private Permission activePerm;

    @BeforeEach
    void setUp() {
        roleId = UUID.randomUUID();
        systemRoleId = UUID.randomUUID();
        userId = UUID.randomUUID();
        permId = UUID.randomUUID();

        customRole = new Role();
        customRole.setCode("EDITOR");
        customRole.setName("Editor Role");
        customRole.setRoleType("CUSTOM");
        customRole.setStatus(OrganizationStatus.ACTIVE);
        ReflectionTestUtils.setField(customRole, "id", roleId);

        systemRole = new Role();
        systemRole.setCode("ADMIN");
        systemRole.setName("Admin Role");
        systemRole.setRoleType("SYSTEM");
        systemRole.setStatus(OrganizationStatus.ACTIVE);
        ReflectionTestUtils.setField(systemRole, "id", systemRoleId);
        
        user = new User("test", "test@test.com", "hash", "USER");
        ReflectionTestUtils.setField(user, "id", userId);
        
        activePerm = new Permission();
        activePerm.setCode("POST_EDIT");
        activePerm.setStatus(OrganizationStatus.ACTIVE);
        ReflectionTestUtils.setField(activePerm, "id", permId);
    }

    @Test
    void createRole_shouldThrow_whenCodeExists() {
        when(roleRepository.existsByCode(anyString())).thenReturn(true);

        RoleRequest req = new RoleRequest();
        req.setCode("EDITOR");

        BusinessConflictException ex = assertThrows(BusinessConflictException.class, () -> 
                roleService.createRole(req)
        );
        assertThat(ex.getErrorCode()).isEqualTo("ROLE_CODE_EXISTS");
    }

    @Test
    void updateRole_shouldThrow_whenTargetIsSystemRole() {
        when(roleRepository.findById(systemRoleId)).thenReturn(Optional.of(systemRole));

        RoleRequest req = new RoleRequest();

        BusinessConflictException ex = assertThrows(BusinessConflictException.class, () -> 
                roleService.updateRole(systemRoleId, req)
        );
        assertThat(ex.getErrorCode()).isEqualTo("SYSTEM_ROLE_PROTECTED");
    }

    @Test
    void changeRoleStatus_shouldThrow_whenDisablingSystemRole() {
        when(roleRepository.findById(systemRoleId)).thenReturn(Optional.of(systemRole));

        BusinessConflictException ex = assertThrows(BusinessConflictException.class, () -> 
                roleService.changeRoleStatus(systemRoleId, OrganizationStatus.INACTIVE)
        );
        assertThat(ex.getErrorCode()).isEqualTo("SYSTEM_ROLE_PROTECTED");
    }

    @Test
    void replacePermissions_shouldSucceed() {
        when(roleRepository.findById(roleId)).thenReturn(Optional.of(customRole));
        when(permissionRepository.findAllById(anySet())).thenReturn(List.of(activePerm));
        when(roleRepository.save(any(Role.class))).thenReturn(customRole);

        RoleResponse res = roleService.replacePermissions(roleId, Set.of(permId));

        assertThat(res.getPermissions()).hasSize(1);
    }

    @Test
    void replacePermissions_shouldThrow_whenPermissionIsInactive() {
        activePerm.setStatus(OrganizationStatus.INACTIVE);
        when(roleRepository.findById(roleId)).thenReturn(Optional.of(customRole));
        when(permissionRepository.findAllById(anySet())).thenReturn(List.of(activePerm));

        BusinessConflictException ex = assertThrows(BusinessConflictException.class, () -> 
                roleService.replacePermissions(roleId, Set.of(permId))
        );
        assertThat(ex.getErrorCode()).isEqualTo("INACTIVE_PERMISSION");
    }

    @Test
    void assignRole_shouldSucceed() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(roleRepository.findById(roleId)).thenReturn(Optional.of(customRole));
        when(userRoleRepository.existsByUserIdAndRoleIdAndStatus(any(), any(), any())).thenReturn(false);
        
        when(userRoleRepository.save(any(UserRole.class))).thenAnswer(i -> {
            UserRole ur = i.getArgument(0);
            ReflectionTestUtils.setField(ur, "id", UUID.randomUUID());
            return ur;
        });

        UserRoleRequest req = new UserRoleRequest();
        req.setRoleId(roleId);
        req.setExpiresAt(Instant.now().plusSeconds(3600));

        UserRoleResponse res = roleService.assignRole(userId, req, "system");

        assertThat(res.getStatus()).isEqualTo("ACTIVE");
    }
    @Test
    void listPermissions_shouldReturnPagedResponse() {
        Page<Permission> page = new PageImpl<>(List.of(activePerm));
        when(permissionRepository.findByFilters(any(), any(), any(Pageable.class))).thenReturn(page);
        
        var res = roleService.listPermissions("AUTH", OrganizationStatus.ACTIVE, 1, 10);
        assertThat(res.getItems()).hasSize(1);
    }

    @Test
    void listRoles_shouldReturnPagedResponse() {
        Page<Role> page = new PageImpl<>(List.of(customRole));
        when(roleRepository.findByFilters(any(), any(), any(), any(Pageable.class))).thenReturn(page);
        
        var res = roleService.listRoles("CUSTOM", OrganizationStatus.ACTIVE, "Ed", 1, 10);
        assertThat(res.getItems()).hasSize(1);
    }

    @Test
    void createRole_shouldSucceed() {
        when(roleRepository.existsByCode(anyString())).thenReturn(false);
        when(roleRepository.save(any(Role.class))).thenReturn(customRole);
        
        RoleRequest req = new RoleRequest();
        req.setCode("EDITOR");
        req.setName("Editor Role");
        var res = roleService.createRole(req);
        
        assertThat(res.getCode()).isEqualTo("EDITOR");
        assertThat(res.getRoleType()).isEqualTo("CUSTOM");
    }

    @Test
    void getRoleDetail_shouldReturnRole() {
        when(roleRepository.findById(roleId)).thenReturn(Optional.of(customRole));
        var res = roleService.getRoleDetail(roleId);
        assertThat(res.getCode()).isEqualTo("EDITOR");
    }
    
    @Test
    void getRoleDetail_shouldThrow_whenNotFound() {
        when(roleRepository.findById(any())).thenReturn(Optional.empty());
        assertThrows(com.re.ecommerce.common.exception.ResourceNotFoundException.class, () -> roleService.getRoleDetail(roleId));
    }

    @Test
    void updateRole_shouldSucceed() {
        when(roleRepository.findById(roleId)).thenReturn(Optional.of(customRole));
        when(roleRepository.save(any(Role.class))).thenReturn(customRole);

        RoleRequest req = new RoleRequest();
        req.setName("New Name");
        roleService.updateRole(roleId, req);

        // Verify the entity was mutated before save
        assertThat(customRole.getName()).isEqualTo("New Name");
        verify(roleRepository).save(customRole);
    }

    @Test
    void changeRoleStatus_shouldSucceed() {
        when(roleRepository.findById(roleId)).thenReturn(Optional.of(customRole));
        when(roleRepository.save(any())).thenReturn(customRole);
        
        var res = roleService.changeRoleStatus(roleId, OrganizationStatus.INACTIVE);
        assertThat(res).isNotNull();
    }

    @Test
    void replacePermissions_shouldThrow_whenPermissionNotFound() {
        when(roleRepository.findById(roleId)).thenReturn(Optional.of(customRole));
        when(permissionRepository.findAllById(anySet())).thenReturn(List.of()); // Found 0, requested 1
        
        assertThrows(com.re.ecommerce.common.exception.ResourceNotFoundException.class, () -> 
                roleService.replacePermissions(roleId, Set.of(permId))
        );
    }

    @Test
    void listAssignments_shouldReturnAssignments() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        
        UserRole ur = new UserRole();
        ur.setUser(user);
        ur.setRole(customRole);
        ur.setStatus("ACTIVE");
        ReflectionTestUtils.setField(ur, "id", UUID.randomUUID());
        
        when(userRoleRepository.findByUserId(userId)).thenReturn(List.of(ur));
        var res = roleService.listAssignments(userId);
        
        assertThat(res).hasSize(1);
    }

    @Test
    void listAssignments_shouldThrow_whenUserNotFound() {
        when(userRepository.findById(any())).thenReturn(Optional.empty());
        assertThrows(com.re.ecommerce.common.exception.ResourceNotFoundException.class, () -> 
                roleService.listAssignments(userId)
        );
    }
    
    @Test
    void assignRole_shouldThrow_whenUserNotFound() {
        when(userRepository.findById(any())).thenReturn(Optional.empty());
        assertThrows(com.re.ecommerce.common.exception.ResourceNotFoundException.class, () -> 
                roleService.assignRole(userId, new UserRoleRequest(), "sys")
        );
    }

    @Test
    void assignRole_shouldThrow_whenRoleInactive() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        customRole.setStatus(OrganizationStatus.INACTIVE);
        when(roleRepository.findById(roleId)).thenReturn(Optional.of(customRole));
        
        UserRoleRequest req = new UserRoleRequest();
        req.setRoleId(roleId);
        
        var ex = assertThrows(BusinessConflictException.class, () -> roleService.assignRole(userId, req, "sys"));
        assertThat(ex.getErrorCode()).isEqualTo("ROLE_INACTIVE");
    }

    @Test
    void assignRole_shouldThrow_whenAssignmentExists() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(roleRepository.findById(roleId)).thenReturn(Optional.of(customRole));
        when(userRoleRepository.existsByUserIdAndRoleIdAndStatus(any(), any(), any())).thenReturn(true);
        
        UserRoleRequest req = new UserRoleRequest();
        req.setRoleId(roleId);
        
        var ex = assertThrows(BusinessConflictException.class, () -> roleService.assignRole(userId, req, "sys"));
        assertThat(ex.getErrorCode()).isEqualTo("ASSIGNMENT_EXISTS");
    }

    @Test
    void revokeAssignment_shouldSucceed() {
        UserRole ur = new UserRole();
        ur.setUser(user);
        ur.setRole(customRole);
        ur.setStatus("ACTIVE");
        ReflectionTestUtils.setField(ur, "id", UUID.randomUUID());
        
        when(userRoleRepository.findById(any())).thenReturn(Optional.of(ur));
        when(userRoleRepository.save(any())).thenReturn(ur);
        
        var res = roleService.revokeAssignment(userId, ur.getId(), "sys", "test");
        assertThat(res.getStatus()).isEqualTo("REVOKED");
        assertThat(res.getRevokedReason()).isEqualTo("test");
    }

    @Test
    void revokeAssignment_shouldThrow_whenAssignmentNotFound() {
        when(userRoleRepository.findById(any())).thenReturn(Optional.empty());
        assertThrows(com.re.ecommerce.common.exception.ResourceNotFoundException.class, () -> 
                roleService.revokeAssignment(userId, UUID.randomUUID(), "sys", "test")
        );
    }

    @Test
    void revokeAssignment_shouldThrow_whenUserMismatch() {
        UserRole ur = new UserRole();
        User otherUser = new User("other", "other@test.com", "hash", "USER");
        ReflectionTestUtils.setField(otherUser, "id", UUID.randomUUID());
        ur.setUser(otherUser);
        
        when(userRoleRepository.findById(any())).thenReturn(Optional.of(ur));
        
        var ex = assertThrows(BusinessConflictException.class, () -> 
                roleService.revokeAssignment(userId, UUID.randomUUID(), "sys", "test")
        );
        assertThat(ex.getErrorCode()).isEqualTo("INVALID_ASSIGNMENT");
    }
}
