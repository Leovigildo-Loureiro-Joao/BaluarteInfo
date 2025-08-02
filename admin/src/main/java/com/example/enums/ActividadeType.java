package com.example.enums;

import java.util.List;

public enum ActividadeType {
    Culto, 
    Conferência, 
    Evangelismo, 
    Acampamento;

     public static List<String> Lista() {
        return java.util.Arrays.stream(ActividadeType.values())
            .map(type -> type.name())
            .toList();
    }

}
