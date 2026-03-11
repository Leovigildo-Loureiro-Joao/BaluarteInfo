package com.example.models.user;

import java.time.LocalDateTime;

import com.example.dto.audio.AudioDto;
import com.example.utils.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public record UserDtoData(long id,
  String nome,
 String email,
 String img,
 String roles) {
  public static UserDtoData fromJson(String resposta) {
       try {
            Gson gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
                .create();
            return gson.fromJson(resposta, UserDtoData.class);
        } catch (Exception e) {
           return null;
        }
    }

} 