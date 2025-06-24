package com.igreja.api.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.igreja.api.dto.artigo.ArtigoDataDto;
import com.igreja.api.models.ArtigosModel;

public interface ArtigosRepository extends JpaRepository<ArtigosModel,Integer>{
    @Query("SELECT new com.igreja.api.dto.artigo.ArtigoDataDto"+
    "(id,descricao,titulo,escritor,pdf,img,nPagina,tipo,dataPublicacao) from ArtigosModel")
    public List<ArtigoDataDto> findAllData();
}
