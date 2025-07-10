package com.igreja.api.dto.midia;

import org.springframework.web.multipart.MultipartFile;

import com.igreja.api.enums.*;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;

public record MidiaFile(@NotBlank String titulo,@NotBlank String descricao,MultipartFile url,MultipartFile imagem, @Enumerated(EnumType.STRING) MidiaType type,@Enumerated(EnumType.STRING) AudioType audioType) {
    
}
