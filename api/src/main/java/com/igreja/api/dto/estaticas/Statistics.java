package com.igreja.api.dto.estaticas;

import java.util.List;

import jakarta.validation.constraints.NotNull;

public record Statistics(@NotNull List<Value> listaValues) {
    
}
