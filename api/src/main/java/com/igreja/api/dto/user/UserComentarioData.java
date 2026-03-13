package com.igreja.api.dto.user;

import java.time.LocalDate;

import com.igreja.api.enums.ComentarioStatus;
import com.igreja.api.enums.ComentarioType;

public record UserComentarioData(
        int id,
        ComentarioType seccao,
        int seccaoId,
        String seccaoTitulo,
        String descricao,
        LocalDate dataPublicacao,
        int likes,
        ComentarioStatus status) {
}
