package com.re.ecommerce.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.function.Function;

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs}")
    private int jwtExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String username, String role) {
        return generateToken(username, role, null, List.of(), "ADMIN".equalsIgnoreCase(role));
    }

    public String generateToken(String username, String role, String familyId) {
        return generateToken(username, role, familyId, List.of(), "ADMIN".equalsIgnoreCase(role));
    }

    public String generateToken(String username, String role, String familyId, List<String> permissions, boolean adminPortal) {
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .claim("familyId", familyId)
                .claim("permissions", permissions)
                .claim("adminPortal", adminPortal)
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }
    
    public String getRoleFromToken(String token) {
        return getClaimFromToken(token, claims -> claims.get("role", String.class));
    }

    public String getFamilyIdFromToken(String token) {
        return getClaimFromToken(token, claims -> claims.get("familyId", String.class));
    }

    @SuppressWarnings("unchecked")
    public List<String> getPermissionsFromToken(String token) {
        List<?> values = getClaimFromToken(token, claims -> claims.get("permissions", List.class));
        return values == null ? List.of() : values.stream().filter(String.class::isInstance).map(String.class::cast).toList();
    }

    public boolean hasAdminPortalAccess(String token) {
        Boolean value = getClaimFromToken(token, claims -> claims.get("adminPortal", Boolean.class));
        return Boolean.TRUE.equals(value);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claimsResolver.apply(claims);
    }

    public boolean validateToken(String token) {
        Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token);
        return true;
    }
}
