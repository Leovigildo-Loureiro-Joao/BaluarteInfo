package com.igreja.api.dto.midia;

import java.time.LocalDateTime;

import com.igreja.api.enums.AudioType;
import com.igreja.api.enums.MidiaType;
import com.igreja.api.enums.VideoType;

public record MidiaRelacionadoEdicaoItem(
        int id,
        String titulo,
        String autor,
        String imagem,
        String tempo,
        MidiaType type,
        AudioType audioType,
        VideoType videoType,
        String url,
        Integer actividadeId,
        Integer edicao,
        LocalDateTime dataEvento
) {}

