package com.igreja.api.dto.artigo;

import org.springframework.web.multipart.MultipartFile;

import com.igreja.api.enums.ArtigosType;

import jakarta.validation.constraints.NotBlank;

public record ArtigoDto( int id,@NotBlank String descricao,@NotBlank String titulo,@NotBlank String escritor,MultipartFile pdf,ArtigosType tipo) {

}
