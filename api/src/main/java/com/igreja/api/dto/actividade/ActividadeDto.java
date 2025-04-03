package com.igreja.api.dto.actividade;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ActividadeDto(
    @NotBlank String descricao,

   @NotBlank String tema,

   @NotBlank String tipoEvento,

   @NotBlank String publicoAlvo,

   @NotBlank String Organizador,

   @NotNull LocalDateTime dataPublicacao,

   @NotBlank String contactos,

    @NotBlank MultipartFile img
) {
 
}
