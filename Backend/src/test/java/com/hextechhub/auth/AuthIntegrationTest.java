package com.hextechhub.auth;

import com.hextechhub.auth.dto.AuthResponse;
import com.hextechhub.auth.dto.LoginRequest;
import com.hextechhub.auth.dto.SignupRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.containers.PostgreSQLContainer;

import static org.junit.jupiter.api.Assertions.*;

// Test di integrazione per registrazione e login con PostgreSQL Testcontainers
@Testcontainers
@SpringBootTest
class AuthIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("hextech_test")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void registerProps(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private AuthService authService;

    @Test
    void signupAndLoginFlow() {
        SignupRequest signup = new SignupRequest();
        signup.setEmail("user1@example.com");
        signup.setPassword("Password123!");
        AuthResponse resp = authService.signup(signup);
        assertNotNull(resp.getToken());

        LoginRequest login = new LoginRequest();
        login.setEmail("user1@example.com");
        login.setPassword("Password123!");
        AuthResponse loginResp = authService.login(login);
        assertNotNull(loginResp.getToken());
    }
}