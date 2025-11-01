package com.example.models.config;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import com.example.dto.actividade.ActividadeDtoSimple;
import com.example.enums.ConfigType;
import com.example.utils.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public record ConfigDto(double value,ConfigType type) {
    public static ConfigDto fromJson(String resposta) {
       try {
            Gson gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
                .create();
            return gson.fromJson(resposta, ConfigDto.class);
        } catch (Exception e) {
           return null;
        }
    }

    public Map<String, String> toMap() {
        Map<String, String> map = new HashMap<>();
        map.put("value", value+"");
        map.put("type", type.name());
        return map;
    }
}
