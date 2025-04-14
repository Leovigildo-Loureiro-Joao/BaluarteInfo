package com.igreja.api.dto.mensage;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record MensagemData(@NotBlank String descricao,@NotBlank String assunto) {
    
}
