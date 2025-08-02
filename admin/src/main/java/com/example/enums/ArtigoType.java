package com.example.enums;

import java.util.List;

public enum ArtigoType {
    BIBLE_STUDY("Estudo Bíblico"),    // 
    DEVOTIONAL("Devocional"),     // 
    HISTORICAL("Histórico"),     // 
    DOCTRINAL("Doutrinário"),      // 
    TESTIMONY("Testemunho"),      // 
    APOLOGETICS("Apologética"),    // 
    PROPHETIC("Profético"),      // 
    THEOLOGICAL("Teológico");    // 

    public String value;

    private ArtigoType(String descricao){
        value=descricao;
    }

    public static List<String> Lista() {
        return java.util.Arrays.stream(ArtigoType.values())
            .map(type -> type.value)
            .toList();
    }

    public static ArtigoType fromValue(String value) {
        for (ArtigoType type : ArtigoType.values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Tipo de artigo inválido: " + value);
    }
}
