package com.re.ecommerce.modules.staff.repository;

import com.re.ecommerce.modules.staff.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;
import java.time.Instant;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRoleRepository extends JpaRepository<UserRole, UUID> {
    List<UserRole> findByUserId(UUID userId);
    
    boolean existsByUserIdAndRoleIdAndStatus(UUID userId, UUID roleId, String status);

    /** Assignments usable at the supplied instant, including their effective permissions. */
    @Query("select distinct ur from UserRole ur join fetch ur.role r left join fetch r.permissions p " +
           "where ur.user.id = :userId and ur.status = 'ACTIVE' and r.status = com.re.ecommerce.modules.staff.entity.OrganizationStatus.ACTIVE " +
           "and (ur.expiresAt is null or ur.expiresAt > :now)")
    List<UserRole> findEffectiveByUserId(@Param("userId") UUID userId, @Param("now") Instant now);
}
