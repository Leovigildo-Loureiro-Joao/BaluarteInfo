package com.igreja.api.dto.comentario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ComentarioResult(@NotNull int id,@NotBlank String imagem,String name,@NotBlank String descricao) {
    
}
