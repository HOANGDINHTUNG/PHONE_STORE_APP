package com.re.ecommerce.modules.staff.repository;

import com.re.ecommerce.modules.staff.entity.Department;
import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface DepartmentRepository extends JpaRepository<Department, UUID> {
    boolean existsByCode(String code);
    boolean existsByName(String name);

    @Query("SELECT d FROM Department d WHERE " +
           "(:status IS NULL OR d.status = :status) AND " +
           "(:keyword IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(d.code) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Department> findByFilters(@Param("status") OrganizationStatus status, @Param("keyword") String keyword, Pageable pageable);
}
