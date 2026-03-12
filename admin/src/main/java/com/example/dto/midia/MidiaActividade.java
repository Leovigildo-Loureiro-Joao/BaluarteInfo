package com.example.dto.midia;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import com.example.dto.actividade.ActividadeDtoSimple;
import com.example.enums.MidiaType;
import com.example.utils.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public record MidiaActividade(int id,String titulo,MidiaType type,String img) {

    public Map<String, String> toMap() {
        Map<String, String> map = new HashMap<>();
            map.put("titulo", titulo);
            map.put("type", type.name());
            map.put("id", id+"");
            return map;
    }

    public Map<String, String> toMapV() {
        Map<String, String> map = new HashMap<>();
            map.put("titulo", titulo);
            map.put("type", type.name());
            map.put("id", id+"");
            map.put("img", img);
            return map;
    }

     public static MidiaActividade fromJson(String resposta) {
       try {
            Gson gson = new GsonBuilder()
                .create();
            return gson.fromJson(resposta, MidiaActividade.class);
        } catch (Exception e) {
           return null;
        }
    }
    
}

