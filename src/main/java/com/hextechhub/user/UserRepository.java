package com.hextechhub.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// Repository JPA per l'entità User
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}