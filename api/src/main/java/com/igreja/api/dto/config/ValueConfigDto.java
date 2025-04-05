package com.igreja.api.dto.config;

import jakarta.validation.constraints.NotNull;

public record ValueConfigDto(@NotNull int id,@NotNull String value) {
    
}
