package com.igreja.api.projection.midia;

import com.igreja.api.enums.VideoType;

public interface VideoProjection {
    Integer getId();
    String getDescricao();
    String getTitulo();
    String getAutor();
    String getUrl();
    VideoType getVideoType();

    /** Visualizações deste vídeo */
    Long getVisualizacoes();
}
