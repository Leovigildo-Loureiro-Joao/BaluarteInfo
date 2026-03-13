package com.igreja.api.dto.comentario;

import java.time.LocalDate;

import com.igreja.api.enums.ComentarioStatus;
import com.igreja.api.enums.ComentarioType;

public record ComentarioAdminData(
        int id,
        ComentarioType seccao,
        int seccaoId,
        String seccaoTitulo,
        long usuarioId,
        String usuarioNome,
        String usuarioEmail,
        String usuarioImagem,
        String descricao,
        LocalDate dataPublicacao,
        int likes,
        ComentarioStatus status,
        int denuncias) {
}
