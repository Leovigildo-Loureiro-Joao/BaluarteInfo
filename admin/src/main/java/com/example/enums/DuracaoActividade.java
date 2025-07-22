package com.example.enums;

public enum DuracaoActividade {
    Mensal,
    Anual,
    Projecto;

    public static List<String> Lista() {
        return java.util.Arrays.stream(AudioType.values())
            .map(type -> type.value)
            .toList();
    }
}
