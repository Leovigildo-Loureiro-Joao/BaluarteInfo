package com.igreja.api.dto.actividade;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import com.igreja.api.enums.ActividadeType;
import com.igreja.api.enums.PublicoAlvoType;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record ActividadeDtoSimple(
    @NotNull int id,
    @NotBlank String descricao,
    @NotBlank String tema,
    @NotBlank  String titulo,
    @NotBlank String endereco,

    @Enumerated(EnumType.STRING) ActividadeType tipoEvento,

    @Enumerated(EnumType.STRING) PublicoAlvoType publicoAlvo,

    @NotBlank String organizador,

    @NotNull LocalDateTime dataEvento,
    @NotNull LocalDateTime dataPublicacao,

    @Pattern(regexp = "\\d+", message = "O campo 'contactos' deve conter apenas números.")
    String contactos,

    String img) {
    
}
