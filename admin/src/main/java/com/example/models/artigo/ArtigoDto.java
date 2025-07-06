package com.example.models.artigo;

import java.time.LocalDateTime;

import com.example.enums.ArtigoType;

public record ArtigoDto(Integer id,String descricao, String titulo, String escritor,String pdf,String img,int nPagina,ArtigoType tipo,LocalDateTime dataPublicacao) {

}
