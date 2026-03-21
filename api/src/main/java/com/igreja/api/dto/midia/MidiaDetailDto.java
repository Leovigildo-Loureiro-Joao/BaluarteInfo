package com.igreja.api.dto.midia;

import java.time.LocalDate;

import com.igreja.api.enums.AudioType;
import com.igreja.api.enums.MidiaType;
import com.igreja.api.enums.VideoType;

public record MidiaDetailDto(
        int id,
        String titulo,
        String descricao,
        String autor,
        String imagem,
        String tempo,
        MidiaType type,
        AudioType audioType,
        VideoType videoType,
        String url,
        LocalDate dataPublicacao,
        long visualizacoes) {
}

