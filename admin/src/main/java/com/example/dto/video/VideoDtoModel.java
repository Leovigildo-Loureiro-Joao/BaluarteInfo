package com.example.dto.video;

import java.time.LocalDateTime;

import com.example.utils.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public record VideoDtoModel( String descricao,int id,String url) {

    public static VideoDtoModel fromJson(String resposta) {
        try {
            Gson gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
                .create();
            return gson.fromJson(resposta, VideoDtoModel.class);
        } catch (Exception e) {
           return null;
        }
    }
    
}