package com.re.ecommerce.modules.customer.repository;

import com.re.ecommerce.modules.customer.entity.ShippingAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ShippingAddressRepository extends JpaRepository<ShippingAddress, UUID> {

    @Query("SELECT s FROM ShippingAddress s WHERE s.customer.id = :customerId AND s.deletedAt IS NULL ORDER BY s.isDefault DESC, s.updatedAt DESC")
    List<ShippingAddress> findActiveByCustomerId(@Param("customerId") UUID customerId);

    @Query("SELECT s FROM ShippingAddress s WHERE s.id = :id AND s.customer.id = :customerId AND s.deletedAt IS NULL")
    Optional<ShippingAddress> findActiveByIdAndCustomerId(@Param("id") UUID id, @Param("customerId") UUID customerId);

    @Modifying
    @Query("UPDATE ShippingAddress s SET s.isDefault = false WHERE s.customer.id = :customerId AND s.deletedAt IS NULL")
    void clearDefaultByCustomerId(@Param("customerId") UUID customerId);

    @Query("SELECT COUNT(s) FROM ShippingAddress s WHERE s.customer.id = :customerId AND s.deletedAt IS NULL")
    long countActiveByCustomerId(@Param("customerId") UUID customerId);
}
