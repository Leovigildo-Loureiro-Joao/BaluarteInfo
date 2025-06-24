package com.igreja.api.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.igreja.api.dto.actividade.ActividadeDto;
import com.igreja.api.dto.actividade.ActividadeDtoSimple;
import com.igreja.api.models.ActividadeModel;

public interface ActividadeRepository extends JpaRepository<ActividadeModel,Integer>{
    @Query(value = "SELECT new com.igreja.api.dto.actividade.ActividadeDtoSimple(id, descricao, tema, titulo, endereco, tipoEvento, publicoAlvo, organizador, dataEvento, dataPublicacao, contactos, img) FROM ActividadeModel")
    List<ActividadeDtoSimple> AllActividadeSimple();

    @Query("Select dataEvento from ActividadeModel")
     List<LocalDateTime> DatasMarcadas();
}
