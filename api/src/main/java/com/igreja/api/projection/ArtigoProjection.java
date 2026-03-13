package com.igreja.api.projection;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;

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

    /** Quantidade total de visualizações registradas */
    @Value("#{target.vistos.size()}")
    Integer getVisualizacoes();

    /** Total de comentários associados ao artigo */
    @Value("#{target.comentarios.size()}")
    Integer getComentarios();

}
