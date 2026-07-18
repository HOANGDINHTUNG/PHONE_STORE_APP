package com.re.ecommerce.modules.staff.repository;

import com.re.ecommerce.modules.staff.entity.StaffProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface StaffProfileRepository extends JpaRepository<StaffProfile, UUID> {
    boolean existsByEmployeeCode(String employeeCode);

    @Query(value = "SELECT sp FROM StaffProfile sp " +
                   "JOIN FETCH sp.user u " +
                   "JOIN FETCH sp.position p " +
                   "JOIN FETCH p.department d " +
                   "LEFT JOIN FETCH sp.manager m " +
                   "WHERE :keyword IS NULL OR LOWER(sp.employeeCode) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                   "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                   "OR LOWER(sp.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) ",
           countQuery = "SELECT COUNT(sp) FROM StaffProfile sp " +
                   "JOIN sp.user u " +
                   "WHERE :keyword IS NULL OR LOWER(sp.employeeCode) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                   "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                   "OR LOWER(sp.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<StaffProfile> findByFilters(@Param("keyword") String keyword, Pageable pageable);
}
