package com.igreja.api.dto.actividade;

import java.time.LocalDateTime;

import com.igreja.api.enums.ProgramacaoTipo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProgramacaoItemUpsertDto(
        @NotBlank String titulo,
        @NotNull LocalDateTime inicio,
        LocalDateTime fim,
        ProgramacaoTipo tipo,
        Integer ordem) {
}

