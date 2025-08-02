package com.example.enums;

import java.util.List;

public enum PublicoAlvoType {
    Mulheres,
    Velhos,
    Pais,
    Casais,
    Jovens,
    Criancas,
    Todos;

     public static List<String> Lista() {
        return java.util.Arrays.stream(PublicoAlvoType.values())
            .map(type -> type.name())
            .toList();
    }
}
