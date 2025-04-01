package com.igreja.api.dtos.user;

import org.springframework.web.multipart.MultipartFile;

import com.igreja.api.enums.InfoType;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

public record InfoDto(@Enumerated(EnumType.STRING) InfoType type,String descricao,MultipartFile img) {
    
}
