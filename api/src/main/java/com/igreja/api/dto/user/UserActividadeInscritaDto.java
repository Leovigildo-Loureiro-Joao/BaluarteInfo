package com.igreja.api.dto.user;

import java.time.LocalDateTime;

import com.igreja.api.enums.ActividadeType;
import com.igreja.api.enums.DuracaoActividade;
import com.igreja.api.enums.PublicoAlvoType;
import com.igreja.api.enums.StatusIncritos;

public record UserActividadeInscritaDto(
        int actividadeId,
        String titulo,
        String tema,
        String endereco,
        ActividadeType tipoEvento,
        PublicoAlvoType publicoAlvo,
        DuracaoActividade duracao,
        LocalDateTime dataEvento,
        String img,
        LocalDateTime dataInscricao,
        StatusIncritos status) {
}
