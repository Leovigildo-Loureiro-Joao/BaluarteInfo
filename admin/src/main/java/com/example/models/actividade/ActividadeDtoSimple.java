package com.example.models.actividade;

import java.time.LocalDateTime;

import com.example.enums.ActividadeType;
import com.example.enums.PublicoAlvoType;


public record ActividadeDtoSimple(
    int id,
    String descricao,
    String tema,
    String titulo,
    String endereco,
    ActividadeType tipoEvento,
    PublicoAlvoType publicoAlvo,
    String organizador,
    LocalDateTime dataEvento,
    LocalDateTime dataPublicacao,
    String contactos,
    String img
    ) {
    
}