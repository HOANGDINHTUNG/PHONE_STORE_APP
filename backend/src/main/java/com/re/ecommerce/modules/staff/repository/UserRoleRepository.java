package com.re.ecommerce.modules.staff.repository;

import com.re.ecommerce.modules.staff.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserRoleRepository extends JpaRepository<UserRole, UUID> {
    List<UserRole> findByUserId(UUID userId);
    
    boolean existsByUserIdAndRoleIdAndStatus(UUID userId, UUID roleId, String status);
}
