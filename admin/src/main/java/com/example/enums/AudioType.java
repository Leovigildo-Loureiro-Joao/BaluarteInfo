package com.example.enums;

import java.util.*;

public enum AudioType {
    SERMON("Sermão"),
    DEVOTIONAL("Devocional"),
    TESTIMONY("Testemunho"),
    MUSIC("Louvor"),
    PRAYER("Oração"),
    STUDY("Estudo"),
    PODCAST("Podcast"),
    ANNOUNCEMENT("Aviso");

    public final String value;

    private AudioType(String descricao) {
        this.value = descricao;
    }

     public static List<String> Lista() {
    return java.util.Arrays.stream(AudioType.values())
        .map(type -> type.value)
        .toList();
}
}