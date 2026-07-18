package com.re.ecommerce.modules.staff.service;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.staff.dto.request.RoleRequest;
import com.re.ecommerce.modules.staff.dto.request.UserRoleRequest;
import com.re.ecommerce.modules.staff.dto.response.PermissionResponse;
import com.re.ecommerce.modules.staff.dto.response.RoleResponse;
import com.re.ecommerce.modules.staff.dto.response.UserRoleResponse;
import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import com.re.ecommerce.modules.staff.entity.Permission;
import com.re.ecommerce.modules.staff.entity.Role;
import com.re.ecommerce.modules.staff.entity.UserRole;
import com.re.ecommerce.modules.staff.repository.PermissionRepository;
import com.re.ecommerce.modules.staff.repository.RoleRepository;
import com.re.ecommerce.modules.staff.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRoleRepository userRoleRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PagedResponse<PermissionResponse> listPermissions(String module, OrganizationStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.ASC, "code"));
        Page<Permission> perms = permissionRepository.findByFilters(module, status, pageable);
        List<PermissionResponse> items = perms.stream().map(this::mapPermission).toList();
        return PagedResponse.of(perms, items);
    }

    @Transactional(readOnly = true)
    public PagedResponse<RoleResponse> listRoles(String roleType, OrganizationStatus status, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Role> roles = roleRepository.findByFilters(roleType, status, keyword, pageable);
        List<RoleResponse> items = roles.stream().map(this::mapRole).toList();
        return PagedResponse.of(roles, items);
    }

    @Transactional
    public RoleResponse createRole(RoleRequest request) {
        if (roleRepository.existsByCode(request.getCode())) {
            throw new BusinessConflictException("ROLE_CODE_EXISTS", "Mã role đã tồn tại");
        }
        Role role = new Role();
        role.setCode(request.getCode());
        role.setName(request.getName());
        role.setDescription(request.getDescription());
        role.setRoleType("CUSTOM");
        role.setStatus(OrganizationStatus.ACTIVE);
        return mapRole(roleRepository.save(role));
    }

    @Transactional(readOnly = true)
    public RoleResponse getRoleDetail(UUID id) {
        return mapRole(getRoleOrThrow(id));
    }

    @Transactional
    public RoleResponse updateRole(UUID id, RoleRequest request) {
        Role role = getRoleOrThrow(id);
        if ("SYSTEM".equals(role.getRoleType())) {
            throw new BusinessConflictException("SYSTEM_ROLE_PROTECTED", "Không được sửa role hệ thống");
        }
        role.setName(request.getName());
        role.setDescription(request.getDescription());
        return mapRole(roleRepository.save(role));
    }

    @Transactional
    public RoleResponse changeRoleStatus(UUID id, OrganizationStatus status) {
        Role role = getRoleOrThrow(id);
        if ("SYSTEM".equals(role.getRoleType()) && status == OrganizationStatus.INACTIVE) {
            throw new BusinessConflictException("SYSTEM_ROLE_PROTECTED", "Không được vô hiệu hóa role hệ thống");
        }
        role.setStatus(status);
        return mapRole(roleRepository.save(role));
    }

    @Transactional
    public RoleResponse replacePermissions(UUID id, Set<UUID> permissionIds) {
        Role role = getRoleOrThrow(id);
        if ("SYSTEM".equals(role.getRoleType())) {
            throw new BusinessConflictException("SYSTEM_ROLE_PROTECTED", "Không được thay đổi quyền của role hệ thống");
        }
        
        List<Permission> permissions = permissionRepository.findAllById(permissionIds);
        if (permissions.size() != permissionIds.size()) {
            throw new ResourceNotFoundException("INVALID_PERMISSIONS", "Có quyền không tồn tại");
        }
        
        boolean hasInactive = permissions.stream().anyMatch(p -> p.getStatus() != OrganizationStatus.ACTIVE);
        if (hasInactive) {
            throw new BusinessConflictException("INACTIVE_PERMISSION", "Chỉ được cấp quyền ACTIVE");
        }

        role.getPermissions().clear();
        role.getPermissions().addAll(permissions);
        return mapRole(roleRepository.save(role));
    }

    @Transactional(readOnly = true)
    public List<UserRoleResponse> listAssignments(UUID userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND", "Không tìm thấy user"));
        List<UserRole> assignments = userRoleRepository.findByUserId(userId);
        return assignments.stream().map(this::mapAssignment).toList();
    }

    @Transactional
    public UserRoleResponse assignRole(UUID userId, UserRoleRequest request, String assignedBy) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND", "Không tìm thấy user"));
        Role role = getRoleOrThrow(request.getRoleId());
        
        if (role.getStatus() != OrganizationStatus.ACTIVE) {
            throw new BusinessConflictException("ROLE_INACTIVE", "Role đang bị vô hiệu hóa");
        }
        
        if (userRoleRepository.existsByUserIdAndRoleIdAndStatus(userId, role.getId(), "ACTIVE")) {
            throw new BusinessConflictException("ASSIGNMENT_EXISTS", "User đã có role này và đang ACTIVE");
        }

        UserRole assignment = new UserRole();
        assignment.setUser(user);
        assignment.setRole(role);
        assignment.setStatus("ACTIVE");
        assignment.setExpiresAt(request.getExpiresAt());
        assignment.setAssignedBy(assignedBy);
        return mapAssignment(userRoleRepository.save(assignment));
    }

    @Transactional
    public UserRoleResponse revokeAssignment(UUID userId, UUID assignmentId, String revokedBy, String reason) {
        UserRole assignment = userRoleRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("ASSIGNMENT_NOT_FOUND", "Không tìm thấy role assignment"));
                
        if (!assignment.getUser().getId().equals(userId)) {
            throw new BusinessConflictException("INVALID_ASSIGNMENT", "Assignment không thuộc về user này");
        }

        assignment.setStatus("REVOKED");
        assignment.setRevokedAt(Instant.now());
        assignment.setRevokedBy(revokedBy);
        assignment.setRevokedReason(reason);
        return mapAssignment(userRoleRepository.save(assignment));
    }

    private Role getRoleOrThrow(UUID id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ROLE_NOT_FOUND", "Không tìm thấy role"));
    }

    private PermissionResponse mapPermission(Permission p) {
        return PermissionResponse.builder()
                .id(p.getId())
                .code(p.getCode())
                .module(p.getModule())
                .description(p.getDescription())
                .status(p.getStatus())
                .build();
    }

    private RoleResponse mapRole(Role r) {
        Set<PermissionResponse> perms = null;
        if (r.getPermissions() != null) {
            perms = r.getPermissions().stream().map(this::mapPermission).collect(Collectors.toSet());
        }
        return RoleResponse.builder()
                .id(r.getId())
                .code(r.getCode())
                .name(r.getName())
                .description(r.getDescription())
                .roleType(r.getRoleType())
                .status(r.getStatus())
                .permissions(perms)
                .build();
    }
    
    private UserRoleResponse mapAssignment(UserRole ur) {
        return UserRoleResponse.builder()
                .id(ur.getId())
                .userId(ur.getUser().getId())
                .role(UserRoleResponse.RoleSummary.builder()
                        .id(ur.getRole().getId())
                        .code(ur.getRole().getCode())
                        .name(ur.getRole().getName())
                        .build())
                .status(ur.getStatus())
                .expiresAt(ur.getExpiresAt())
                .revokedAt(ur.getRevokedAt())
                .assignedAt(ur.getAssignedAt())
                .assignedBy(ur.getAssignedBy())
                .revokedBy(ur.getRevokedBy())
                .revokedReason(ur.getRevokedReason())
                .build();
    }
}
