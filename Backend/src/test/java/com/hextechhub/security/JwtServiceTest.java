package com.hextechhub.security;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Map;

// Test unitario per JwtService
@SpringBootTest
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    @Test
    void generateAndValidateToken() {
        String token = jwtService.generateToken("test@example.com", Map.of("role", "USER"));
        Assertions.assertNotNull(token);
        Assertions.assertTrue(jwtService.isTokenValid(token));
        Assertions.assertEquals("test@example.com", jwtService.extractEmail(token));
    }
}