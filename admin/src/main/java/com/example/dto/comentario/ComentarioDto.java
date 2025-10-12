package com.example.dto.comentario;

import java.time.LocalDateTime;

import com.example.utils.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public record ComentarioDto(int id, String imagem,String name, String descricao,boolean analise) {
    public static ComentarioDto fromJson(String resposta){
        Gson gson = new GsonBuilder()
        .registerTypeAdapter(LocalDateTime.class,new LocalDateTimeAdapter())
        .create();
        return gson.fromJson(resposta, ComentarioDto.class);
    }
}
