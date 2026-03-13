package com.igreja.api.projection.midia;

import org.springframework.beans.factory.annotation.Value;

import com.igreja.api.enums.VideoType;

public interface VideoProjection {
    Integer getId();
    String getDescricao();
    String getTitulo();
    String getUrl();
    VideoType getVideoType();

    /** Visualizações deste vídeo */
    @Value("#{target.vistos.size()}")
    Integer getVisualizacoes();
}
