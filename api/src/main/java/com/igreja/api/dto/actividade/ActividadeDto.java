package com.igreja.api.dto.actividade;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import com.igreja.api.enums.ActividadeType;
import com.igreja.api.enums.PublicoAlvoType;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ActividadeDto(
    @NotBlank String descricao,

   @NotBlank String tema,

   @Enumerated(EnumType.STRING) ActividadeType tipoEvento,

   @Enumerated(EnumType.STRING) PublicoAlvoType publicoAlvo,

   @NotBlank String Organizador,

   @NotNull LocalDateTime dataEvento,

   @NotBlank String contactos,

MultipartFile img
) {
 
}
