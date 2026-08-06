package com.re.ecommerce.security;

import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import com.re.ecommerce.modules.staff.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

/** Resolves permissions from active, non-expired role assignments. */
@Service
@RequiredArgsConstructor
public class EffectiveAccessService {
    private final UserRoleRepository userRoleRepository;

    @Transactional(readOnly = true)
    public List<String> permissionsOf(User user) {
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            // Admin remains a break-glass system account. Endpoint-level hasRole checks retain full access.
            return List.of("ADMIN_PORTAL_ACCESS");
        }

        Set<String> permissions = new TreeSet<>();
        userRoleRepository.findEffectiveByUserId(user.getId(), Instant.now()).forEach(assignment ->
            assignment.getRole().getPermissions().stream()
                .filter(permission -> permission.getStatus() == OrganizationStatus.ACTIVE)
                .map(permission -> permission.getCode())
                .forEach(permissions::add)
        );
        return List.copyOf(permissions);
    }

    public boolean canAccessAdmin(User user, List<String> permissions) {
        return "ADMIN".equalsIgnoreCase(user.getRole()) || !permissions.isEmpty();
    }
}
