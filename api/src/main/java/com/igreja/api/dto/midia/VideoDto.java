package com.igreja.api.dto.midia;

import javax.validation.constraints.NotBlank;

public record VideoDto(Integer id,@NotBlank String descricao,@NotBlank String youtubeID) {
    
}
