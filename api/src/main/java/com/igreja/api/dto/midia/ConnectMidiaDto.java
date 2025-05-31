package com.igreja.api.dto.midia;

import jakarta.validation.constraints.NotNull;

public record ConnectMidiaDto(@NotNull int actividade,@NotNull int midia) {
    
}
