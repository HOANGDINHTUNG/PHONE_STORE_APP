package com.re.ecommerce.modules.auth.repository;

import com.re.ecommerce.modules.auth.entity.TokenFamily;
import com.re.ecommerce.modules.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TokenFamilyRepository extends JpaRepository<TokenFamily, UUID> {
    List<TokenFamily> findByUser(User user);
    List<TokenFamily> findByUserId(UUID userId);
}
