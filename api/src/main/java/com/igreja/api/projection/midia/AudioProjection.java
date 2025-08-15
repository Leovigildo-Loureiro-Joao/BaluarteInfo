package com.igreja.api.projection.midia;

import com.igreja.api.enums.AudioType;

public interface AudioProjection {
    Integer getId();
    String getTitulo();
    String getDescricao();
    String getImagem();
    String getTempo();
    AudioType getAudioType();
    String getUrl();
}
