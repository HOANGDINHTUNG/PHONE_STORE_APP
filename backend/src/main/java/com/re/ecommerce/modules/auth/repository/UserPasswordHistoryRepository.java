package com.re.ecommerce.modules.auth.repository;

import com.re.ecommerce.modules.auth.entity.UserPasswordHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserPasswordHistoryRepository extends JpaRepository<UserPasswordHistory, UUID> {
    List<UserPasswordHistory> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
