package com.example.dto.artigo;

import java.time.LocalDateTime;
import com.example.utils.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import com.example.enums.ArtigoType;

public record ArtigoDto(Integer id,String descricao, String titulo, String escritor,String pdf,String img,int nPagina,ArtigoType tipo,LocalDateTime dataPublicacao) {
    public static ArtigoDto fromJson(String resposta) {
       try {
            Gson gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
                .create();
            return gson.fromJson(resposta, ArtigoDto.class);
        } catch (Exception e) {
           return null;
        }
    }
}
