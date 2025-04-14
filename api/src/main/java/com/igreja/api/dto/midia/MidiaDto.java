package com.igreja.api.dto.midia;

import com.igreja.api.enums.MidiaType;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record MidiaDto(@NotBlank String titulo,@NotBlank String descricao,  @NotBlank(message = "URL é obrigatória")  // Não pode ser vazio
@Pattern(
    regexp = "^(https?|ftp)://[^\\s/$.?#].[^\\s]*$",  // Regex para URLs
    message = "URL inválida! Ex: http://exemplo.com") String url, @Enumerated(EnumType.STRING) MidiaType type) {
    
}
