package valeriodifelice.HextechHub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/** Risposta autenticazione contenente token */
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
}