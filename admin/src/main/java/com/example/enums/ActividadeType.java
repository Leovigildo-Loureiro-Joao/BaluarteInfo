package com.example.enums;

public enum ActividadeType {
    Culto, 
    Conferência, 
    Evangelismo, 
    Acampamento;

     public static List<String> Lista() {
        return java.util.Arrays.stream(AudioType.values())
            .map(type -> type.value)
            .toList();
    }

}
