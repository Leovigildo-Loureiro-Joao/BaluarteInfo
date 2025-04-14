package com.igreja.api.dto.config;

import com.igreja.api.enums.ConfigType;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;

public record ConfiguracaoDto(@NotNull int value,  @Enumerated(EnumType.STRING) ConfigType type) {
    
}
