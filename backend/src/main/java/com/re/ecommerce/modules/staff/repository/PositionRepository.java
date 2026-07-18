package com.re.ecommerce.modules.staff.repository;

import com.re.ecommerce.modules.staff.entity.Position;
import com.re.ecommerce.modules.staff.entity.OrganizationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface PositionRepository extends JpaRepository<Position, UUID> {
    boolean existsByDepartmentIdAndStatus(UUID departmentId, OrganizationStatus status);
    
    boolean existsByCode(String code);

    @Query(value = "SELECT p FROM Position p JOIN FETCH p.department d WHERE " +
           "(:departmentId IS NULL OR d.id = :departmentId) AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.code) LIKE LOWER(CONCAT('%', :keyword, '%')))",
           countQuery = "SELECT count(p) FROM Position p WHERE " +
           "(:departmentId IS NULL OR p.department.id = :departmentId) AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.code) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Position> findByFilters(
            @Param("departmentId") UUID departmentId, 
            @Param("status") OrganizationStatus status, 
            @Param("keyword") String keyword, 
            Pageable pageable);
}
