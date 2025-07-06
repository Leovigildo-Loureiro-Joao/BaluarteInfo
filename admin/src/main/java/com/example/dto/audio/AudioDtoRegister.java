package com.example.dto.audio;

import java.util.HashMap;
import java.util.Map;

import com.example.enums.MidiaType;

public record AudioDtoRegister(String titulo, String descricao, String imagem, String url,MidiaType tipo) {
    public Map<String, String> toMap() {
        Map<String, String> map = new HashMap<>();
        map.put("titulo", titulo);
        map.put("descricao", descricao);
        map.put("imagem", imagem);
        map.put("url", url);
        map.put("type", tipo.name());
        return map;
    }
}
