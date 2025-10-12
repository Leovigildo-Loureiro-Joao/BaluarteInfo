package com.example.dto.comentario;

import java.util.Map;

public record Analise(int id, boolean analise) {
    public Map<String, String> toMap() {
        return Map.of(
            "id", id+"",
            "analise", analise+""
        );
    }
}
