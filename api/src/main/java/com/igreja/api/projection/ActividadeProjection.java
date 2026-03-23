package com.igreja.api.projection;

import java.time.LocalDateTime;

import com.igreja.api.enums.ActividadeType;
import com.igreja.api.enums.DuracaoActividade;
import com.igreja.api.enums.PublicoAlvoType;

public interface ActividadeProjection{
    int getId();

    String getDescricao();

    String getTema();
    
    String getTitulo();

    String getEndereco();

    ActividadeType getTipoEvento();

    DuracaoActividade getDuracao();

    PublicoAlvoType getPublicoAlvo();

    String getOrganizador();

    /** Lista simples de palestrantes (separados por nova linha). */
    String getPalestrantes();

    Integer getEdicao();

    LocalDateTime getDataEvento();

    LocalDateTime getDataPublicacao();

    String getContactos();

    String getImg();

    Integer getCapacidade();

    /** Número total de inscritos vinculados */
    Long getInscritos();
}
