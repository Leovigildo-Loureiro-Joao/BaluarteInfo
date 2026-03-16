package com.igreja.api.dto.artigo;

import org.springframework.web.multipart.MultipartFile;

import com.igreja.api.enums.ArtigoType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ArtigoDtoRegister(
        @NotBlank String descricao,
        @NotBlank String titulo,
        @NotBlank String escritor,
        MultipartFile pdf,
        MultipartFile img,
        ArtigoType tipo,
        @Size(max = 200000) String markdown) {

}
