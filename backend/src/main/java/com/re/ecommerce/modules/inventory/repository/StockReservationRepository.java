package com.re.ecommerce.modules.inventory.repository;

import com.re.ecommerce.modules.inventory.entity.StockReservation;
import com.re.ecommerce.modules.inventory.entity.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StockReservationRepository extends JpaRepository<StockReservation, Long> {
    
    Optional<StockReservation> findByActiveReservationKey(String activeReservationKey);

    List<StockReservation> findByOrderId(UUID orderId);
    
    List<StockReservation> findByStatusAndExpiresAtBefore(ReservationStatus status, LocalDateTime now);
}
