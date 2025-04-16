package com.igreja.api.dto;

import org.springframework.web.multipart.MultipartFile;

import com.igreja.api.enums.InfoType;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;

public record InfoDto(@Enumerated(EnumType.STRING) InfoType type,@NotBlank String descricao,MultipartFile img) {
    
}
