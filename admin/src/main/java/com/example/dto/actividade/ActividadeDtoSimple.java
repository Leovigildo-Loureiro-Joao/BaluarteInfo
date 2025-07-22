package com.example.dto.actividade;

import java.time.LocalDateTime;

import com.example.enums.ActividadeType;
import com.example.enums.PublicoAlvoType;

import com.example.utils.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;


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

    public static ActividadeDtoSimple fromJson(String resposta) {
       try {
            Gson gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
                .create();
            return gson.fromJson(resposta, ActividadeDtoSimple.class);
        } catch (Exception e) {
           return null;
        }
    }
}