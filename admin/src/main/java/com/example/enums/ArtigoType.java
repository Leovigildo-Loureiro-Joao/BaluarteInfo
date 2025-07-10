package com.example.enums;

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
}
