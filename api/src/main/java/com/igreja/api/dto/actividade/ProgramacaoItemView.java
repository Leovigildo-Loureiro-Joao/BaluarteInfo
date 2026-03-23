package com.igreja.api.dto.actividade;

import java.time.LocalDateTime;

import com.igreja.api.enums.ProgramacaoTipo;

public record ProgramacaoItemView(
        int id,
        String titulo,
        LocalDateTime inicio,
        LocalDateTime fim,
        ProgramacaoTipo tipo,
        Integer ordem,
        ProgramacaoStatus status) {
}

