package com.re.ecommerce.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilsTest {

    private JwtUtils jwtUtils;
    
    private final String SECRET = "mytestsecretwhichisverylongtobesecure256bitsorhigher";
    private final int EXPIRATION_MS = 3600000; // 1 hour

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", SECRET);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", EXPIRATION_MS);
    }

    @Test
    void generateToken_And_ExtractInfo() {
        String token = jwtUtils.generateToken("testuser", "USER", "family-123");
        assertNotNull(token);

        assertEquals("testuser", jwtUtils.getUsernameFromToken(token));
        assertEquals("USER", jwtUtils.getRoleFromToken(token));
        assertEquals("family-123", jwtUtils.getFamilyIdFromToken(token));
        assertTrue(jwtUtils.validateToken(token));
    }

    @Test
    void generateToken_WithoutFamilyId() {
        String token = jwtUtils.generateToken("testuser2", "ADMIN");
        assertNotNull(token);

        assertEquals("testuser2", jwtUtils.getUsernameFromToken(token));
        assertEquals("ADMIN", jwtUtils.getRoleFromToken(token));
        assertNull(jwtUtils.getFamilyIdFromToken(token));
        assertTrue(jwtUtils.validateToken(token));
    }

    @Test
    void validateToken_MalformedToken() {
        assertThrows(MalformedJwtException.class, () -> jwtUtils.validateToken("not.a.real.token"));
    }

    @Test
    void validateToken_SignatureException() {
        String token = jwtUtils.generateToken("testuser", "USER");
        // Tamper with token signature
        String tampered = token.substring(0, token.length() - 5) + "abcde";
        assertThrows(SignatureException.class, () -> jwtUtils.validateToken(tampered));
    }

    @Test
    void validateToken_ExpiredToken() {
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", -1000); // Expired immediately
        String token = jwtUtils.generateToken("testuser", "USER");
        assertThrows(ExpiredJwtException.class, () -> jwtUtils.validateToken(token));
    }
}
