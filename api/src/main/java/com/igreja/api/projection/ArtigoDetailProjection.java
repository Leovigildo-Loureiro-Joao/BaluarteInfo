package com.igreja.api.projection;

import java.time.LocalDateTime;

import com.igreja.api.enums.ArtigoType;

public interface ArtigoDetailProjection {
    int getId();

    String getTitulo();

    String getDescricao();

    String getConteudo();

    ArtigoType getTipo();

    String getEscritor();

    String getPdf();

    int getnPagina();

    LocalDateTime getDataPublicacao();

    String getImg();

    Long getVisualizacoes();

    Long getComentarios();
}

