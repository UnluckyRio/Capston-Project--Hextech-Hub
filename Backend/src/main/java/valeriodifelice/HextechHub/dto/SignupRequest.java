package valeriodifelice.HextechHub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import valeriodifelice.HextechHub.model.Region;

/** DTO per sign up */
@Data
public class SignupRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 8, max = 128)
    private String password;

    @NotBlank
    private String fullName;

    @Pattern(regexp = "^[A-Za-z0-9_.\\s]{3,16}#[A-Za-z0-9]{3,5}$", message = "Formato RiotId non valido")
    private String riotId;

    @NotNull
    private Region region;
}