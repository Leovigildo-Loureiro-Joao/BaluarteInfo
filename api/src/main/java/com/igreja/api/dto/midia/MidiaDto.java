package com.igreja.api.dto.midia;

import com.igreja.api.enums.MidiaType;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;

public record MidiaDto(@NotBlank String titulo,@NotBlank String descricao,@NotBlank String url, @Enumerated(EnumType.STRING) MidiaType type) {
    
}
