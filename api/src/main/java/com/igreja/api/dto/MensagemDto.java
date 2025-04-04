package com.igreja.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record MensagemDto(@NotBlank String descricao,@NotBlank String assunto,@Email String email,@Email String destino) {

}
