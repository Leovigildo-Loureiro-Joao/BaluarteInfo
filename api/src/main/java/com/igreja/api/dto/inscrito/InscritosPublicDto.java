package com.igreja.api.dto.inscrito;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record InscritosPublicDto(
        @NotBlank String nome,
        @NotBlank @Email String email,
        @NotBlank String telefone) {
}
