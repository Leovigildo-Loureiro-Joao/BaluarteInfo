package com.igreja.api.dto.artigo;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ArtigoEnhancePreviewUploadDto(
        @NotBlank String titulo,
        @NotBlank String descricao,
        @NotNull MultipartFile pdf,
        String instruction,
        Integer pages) {
}

