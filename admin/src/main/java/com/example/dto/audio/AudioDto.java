package com.example.dto.audio;

import java.time.LocalDateTime;

import com.example.dto.video.VideoDtoModel;
import com.example.utils.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public record AudioDto( int id,String titulo,String descricao,String imagem,String url) {

    public static AudioDto fromJson(String resposta) {
       try {
            Gson gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
                .create();
            return gson.fromJson(resposta, AudioDto.class);
        } catch (Exception e) {
           return null;
        }
    }
    
}