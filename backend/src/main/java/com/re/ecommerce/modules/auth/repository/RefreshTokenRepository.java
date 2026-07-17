package com.re.ecommerce.modules.auth.repository;

import com.re.ecommerce.modules.auth.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    
    Optional<RefreshToken> findByTokenHash(String tokenHash);

    @Modifying
    @Query("UPDATE RefreshToken r SET r.revokedAt = CURRENT_TIMESTAMP, r.revokedReason = :reason WHERE r.tokenFamilyId = :familyId")
    void revokeFamily(UUID familyId, String reason);

    @Modifying
    @Query("UPDATE RefreshToken r SET r.revokedAt = CURRENT_TIMESTAMP, r.revokedReason = :reason WHERE r.user.id = :userId AND r.revokedAt IS NULL")
    void revokeAllUserTokens(UUID userId, String reason);
}
