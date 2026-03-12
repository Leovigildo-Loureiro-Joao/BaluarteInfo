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

    @Override
    public String toString() {
        return value;
    }

    public static AudioType fromValue(String value) {
    for (AudioType type : AudioType.values()) {
        if (type.value.equals(value)) {
            return type;
        }
    }
    throw new IllegalArgumentException("Tipo de áudio inválido: " + value);
}

     public static List<String> Lista() {
    return java.util.Arrays.stream(AudioType.values())
        .map(type -> type.value)
        .toList();
}
}