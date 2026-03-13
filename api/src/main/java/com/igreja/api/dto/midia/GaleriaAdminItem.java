package com.igreja.api.dto.midia;

import java.time.LocalDate;

public record GaleriaAdminItem(
        int id,
        String url,
        String titulo,
        String descricao,
        LocalDate dataPublicacao,
        Integer actividadeId,
        String actividadeTitulo,
        long visualizacoes) {
}
