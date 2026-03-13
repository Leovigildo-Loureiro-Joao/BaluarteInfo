package com.igreja.api.projection.midia;

import org.springframework.beans.factory.annotation.Value;

import com.igreja.api.enums.AudioType;
import com.igreja.api.enums.MidiaType;
import com.igreja.api.enums.VideoType;

public interface MidiaProjection {
    Integer getId();
    String getTitulo();
    String getDescricao();
    String getImagem();
    String getTempo();
    MidiaType getType();
    AudioType getAudioType();
    VideoType getVideoType();
    String getUrl();

    /** Total de visualizações (registros em vistos) */
    @Value("#{target.vistos.size()}")
    Integer getVisualizacoes();
}
