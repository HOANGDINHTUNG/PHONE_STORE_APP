package com.re.ecommerce.modules.staff.repository;

import com.re.ecommerce.modules.staff.entity.Permission;
import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface PermissionRepository extends JpaRepository<Permission, UUID> {
    @Query("SELECT p FROM Permission p WHERE " +
           "(:module IS NULL OR p.module = :module) AND " +
           "(:status IS NULL OR p.status = :status)")
    Page<Permission> findByFilters(@Param("module") String module, @Param("status") OrganizationStatus status, Pageable pageable);
}
