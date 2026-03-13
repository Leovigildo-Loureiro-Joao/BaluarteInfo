package com.igreja.api.dto.comentario;

import com.igreja.api.enums.ComentarioStatus;

import jakarta.validation.constraints.NotNull;

public record ComentarioStatusDto(
        @NotNull ComentarioStatus status,
        String notaInterna) {
}
