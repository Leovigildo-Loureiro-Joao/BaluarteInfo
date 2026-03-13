package com.igreja.api.enums;

public enum DuracaoActividade {
    CURTA("Até 2h"),
    MEDIA("2-4h"),
    LONGA("4-8h"),
    EXTENDIDA("Mais de 8h"),
    MULTIPLOS_DIAS("Múltiplos dias");

    private final String label;

    DuracaoActividade(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }

    public static DuracaoActividade fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String normalized = value.trim();
        for (DuracaoActividade duracao : DuracaoActividade.values()) {
            if (duracao.name().equalsIgnoreCase(normalized) || duracao.label.equalsIgnoreCase(normalized)) {
                return duracao;
            }
        }

        switch (normalized.toUpperCase()) {
            case "MENSAL":
                return CURTA;
            case "ANUAL":
                return EXTENDIDA;
            case "PROJECTO":
            case "PROJETO":
                return MULTIPLOS_DIAS;
            default:
                throw new IllegalArgumentException("Valor inválido para DuracaoActividade: " + value);
        }
    }
}
