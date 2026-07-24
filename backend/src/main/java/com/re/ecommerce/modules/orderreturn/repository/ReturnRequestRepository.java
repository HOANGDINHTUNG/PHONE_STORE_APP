package com.re.ecommerce.modules.orderreturn.repository;

import com.re.ecommerce.modules.orderreturn.entity.ReturnRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {
    Optional<ReturnRequest> findByReturnCode(String returnCode);
}
