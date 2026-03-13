package com.igreja.api.enums;

public enum ActividadeType {
    CULTO("Culto"),
    EVENTO("Evento Especial"),
    ESCOLA("Escola Bíblica"),
    JOVENS("Juventude"),
    FAMILIA("Família"),
    LOUVOR("Louvor"),
    ORACAO("Oração"),
    EVANGELISMO("Evangelismo"),
    ACAMPAMENTO("Acampamento"),
    CONFERENCIA("Conferência");

    private final String label;

    ActividadeType(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }

    public static ActividadeType fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String normalized = value.trim();
        for (ActividadeType type : ActividadeType.values()) {
            if (type.name().equalsIgnoreCase(normalized) || type.label.equalsIgnoreCase(normalized)) {
                return type;
            }
        }

        switch (normalized.toUpperCase()) {
            case "CONFERENCIA", "CONFERÊNCIA":
                return CONFERENCIA;
            case "EVANGELISMO":
                return EVANGELISMO;
            case "ACAMPAMENTO":
                return ACAMPAMENTO;
            default:
                throw new IllegalArgumentException("Valor inválido para ActividadeType: " + value);
        }
    }
}
