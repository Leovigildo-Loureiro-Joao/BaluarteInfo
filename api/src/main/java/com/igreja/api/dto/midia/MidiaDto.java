package com.igreja.api.dto.midia;

import jakarta.validation.constraints.NotBlank;

public record MidiaDto(@NotBlank String titulo,@NotBlank String descricao,@NotBlank String url) {
    
}
