package com.example.enums;

public enum PublicoAlvoType {
    Mulheres,
    Velhos,
    Pais,
    Casais,
    Jovens,
    Criancas,
    Todos;

     public static List<String> Lista() {
        return java.util.Arrays.stream(AudioType.values())
            .map(type -> type.value)
            .toList();
    }
}
