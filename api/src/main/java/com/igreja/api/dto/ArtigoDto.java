package com.igreja.api.dto;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;

public record ArtigoDto(@NotBlank String descricao,@NotBlank String titulo,@NotBlank String escritor,MultipartFile pdf) {

}
