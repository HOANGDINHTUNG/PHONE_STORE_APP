package com.re.ecommerce.modules.staff.repository;

import com.re.ecommerce.modules.staff.entity.Role;
import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    boolean existsByCode(String code);

    @Query("SELECT r FROM Role r WHERE " +
           "(:roleType IS NULL OR r.roleType = :roleType) AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:keyword IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(r.code) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Role> findByFilters(
            @Param("roleType") String roleType,
            @Param("status") OrganizationStatus status,
            @Param("keyword") String keyword,
            Pageable pageable);
}
