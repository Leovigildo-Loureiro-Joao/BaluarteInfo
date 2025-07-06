package com.igreja.api.projection;

import java.time.LocalDateTime;

import com.igreja.api.enums.ArtigoType;

public interface ArtigoProjection {
    
    int getId();

    String getTitulo();

    String getDescricao();

    ArtigoType getTipo();

    String getEscritor();

    String getPdf();

    int getnPagina();

    LocalDateTime getDataPublicacao();

    String getImg();

}
