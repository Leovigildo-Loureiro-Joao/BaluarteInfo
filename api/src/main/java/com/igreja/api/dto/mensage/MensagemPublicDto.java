package com.igreja.api.dto.mensage;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record MensagemPublicDto(
        @NotBlank String nome,
        @NotBlank @Email String email,
        @NotBlank String telefone,
        @NotBlank String assunto,
        @NotBlank String descricao) {
}
