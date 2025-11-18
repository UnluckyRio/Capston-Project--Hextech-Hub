package com.hextechhub.auth;

import com.hextechhub.auth.dto.AuthResponse;
import com.hextechhub.auth.dto.LoginRequest;
import com.hextechhub.auth.dto.SignupRequest;
import com.hextechhub.security.JwtService;
import com.hextechhub.user.Role;
import com.hextechhub.user.User;
import com.hextechhub.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

// Servizio di autenticazione: registrazione e login
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    // Registrazione con validazione ed encryption password
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email già registrata");
        }
        Role role = request.getRole() == null ? Role.USER : request.getRole();
        String hash = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getEmail(), hash, role);
        userRepository.save(user);
        String token = jwtService.generateToken(user.getEmail(), Map.of("role", user.getRole().name()));
        return new AuthResponse(token);
    }

    // Login: verifica credenziali e genera JWT
    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        String token = jwtService.generateToken(auth.getName(), Map.of());
        return new AuthResponse(token);
    }
}