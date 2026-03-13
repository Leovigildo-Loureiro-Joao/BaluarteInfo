package com.igreja.api.enums;

public enum PublicoAlvoType {
    TODOS("Todos"),
    JOVENS("Jovens"),
    ADULTOS("Adultos"),
    CRIANCAS("Crianças"),
    IDOSOS("Idosos"),
    MULHERES("Mulheres"),
    HOMENS("Homens"),
    CASAIS("Casais");

    private final String label;

    PublicoAlvoType(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }

    public static PublicoAlvoType fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String normalized = value.trim();
        for (PublicoAlvoType publico : PublicoAlvoType.values()) {
            if (publico.name().equalsIgnoreCase(normalized) || publico.label.equalsIgnoreCase(normalized)) {
                return publico;
            }
        }

        return switch (normalized.toUpperCase()) {
            case "MULHERES" -> MULHERES;
            case "VELHOS", "IDOSOS" -> IDOSOS;
            case "PAIS" -> ADULTOS;
            case "CASAIS" -> CASAIS;
            case "JOVENS" -> JOVENS;
            case "CRIANÇAS", "CRIANCAS" -> CRIANCAS;
            case "TODOS" -> TODOS;
            default -> throw new IllegalArgumentException("Valor inválido para PublicoAlvoType: " + value);
        };
    }
}
