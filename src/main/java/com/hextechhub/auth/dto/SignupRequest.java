package com.hextechhub.auth.dto;

import com.hextechhub.user.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// DTO per richiesta di registrazione
public class SignupRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 8, max = 255)
    private String password;

    // Ruolo opzionale; default USER se non specificato
    private Role role = Role.USER;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}