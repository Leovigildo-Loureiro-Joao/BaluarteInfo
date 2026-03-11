package com.igreja.api.projection.midia;

import com.igreja.api.enums.VideoType;

public interface VideoProjection {
    Integer getId();
    String getDescricao();
    String getTitulo();
    String getUrl();
    VideoType getVideoType();
}
