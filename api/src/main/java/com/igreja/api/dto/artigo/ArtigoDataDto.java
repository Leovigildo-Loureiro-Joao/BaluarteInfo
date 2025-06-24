package com.igreja.api.dto.artigo;

import java.time.LocalDateTime;

import com.igreja.api.enums.ArtigosType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ArtigoDataDto(@NotNull Integer id,@NotBlank String descricao,@NotBlank String titulo,@NotBlank String escritor,@NotBlank String pdf,@NotBlank String img,@NotNull int npag,ArtigosType tipo,LocalDateTime data) {

}
