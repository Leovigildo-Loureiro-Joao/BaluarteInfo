package com.example.dto.video;

import java.util.HashMap;
import java.util.Map;

import com.example.enums.MidiaType;

public record VideoDtoRegister(String titulo,String descricao,String url,MidiaType type) {
     public Map<String, String> toMap() {
        Map<String, String> map = new HashMap<>();
        map.put("titulo", titulo);
        map.put("descricao", descricao);
        map.put("url", url);
        map.put("type", type.name());
        return map;
    }
}
