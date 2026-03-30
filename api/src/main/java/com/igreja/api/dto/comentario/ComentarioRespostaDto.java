package com.igreja.api.dto.comentario;

import jakarta.validation.constraints.NotBlank;

public record ComentarioRespostaDto(
        @NotBlank String descricao) {
}

