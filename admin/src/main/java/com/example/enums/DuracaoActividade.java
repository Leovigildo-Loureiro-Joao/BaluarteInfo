package com.example.enums;

import java.util.List;

public enum DuracaoActividade {
    Mensal,
    Anual,
    Projecto;

    public static List<String> Lista() {
        return java.util.Arrays.stream(DuracaoActividade.values())
            .map(type -> type.name())
            .toList();
    }
}
