package com.igreja.api.dto.comentario;

import javax.validation.constraints.NotNull;

import com.igreja.api.enums.ComentarioType;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;

public record ComentarioDto(@NotNull long idUser,@NotNull int idSeccao,@Enumerated(EnumType.STRING)ComentarioType seccao,@NotBlank String descricao) {
    
}
