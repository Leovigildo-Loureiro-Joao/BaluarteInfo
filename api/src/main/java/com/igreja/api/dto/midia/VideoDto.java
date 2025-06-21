package com.igreja.api.dto.midia;

import javax.validation.constraints.NotBlank;

public record VideoDto(@NotBlank String descricao,@NotBlank String url) {
    
}
