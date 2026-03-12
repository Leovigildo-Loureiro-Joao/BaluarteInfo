package com.example.dto.artigo;

import java.util.Map;

import com.example.enums.ArtigoType;

import java.util.HashMap;

public record ArtigoRegister(String descricao, String titulo, String escritor,String pdf,ArtigoType tipo) {
    public Map<String, String> toMap() {
        Map<String, String> map = new HashMap<>();
        map.put("titulo", titulo);
        map.put("descricao", descricao);
        map.put("escritor", escritor);
        map.put("tipo", tipo.name());
        return map;
    }
} 