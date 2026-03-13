package com.igreja.api.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.igreja.api.models.ActividadeModel;
import com.igreja.api.enums.ActividadeType;
import com.igreja.api.enums.DuracaoActividade;
import com.igreja.api.enums.PublicoAlvoType;

import com.igreja.api.projection.ActividadeProjection;

public interface ActividadeRepository extends JpaRepository<ActividadeModel,Integer>{
    
     Page<ActividadeProjection> findAllByOrderByIdDesc(Pageable pageable);

    @Query("""
        SELECT a FROM ActividadeModel a
        WHERE (:tipoEvento IS NULL OR a.tipoEvento = :tipoEvento)
          AND (:publicoAlvo IS NULL OR a.publicoAlvo = :publicoAlvo)
          AND (:duracao IS NULL OR a.duracao = :duracao)
          AND (:q IS NULL OR LOWER(a.titulo) LIKE LOWER(CONCAT('%', :q, '%'))
                        OR LOWER(a.tema) LIKE LOWER(CONCAT('%', :q, '%'))
                        OR LOWER(a.descricao) LIKE LOWER(CONCAT('%', :q, '%')))
        ORDER BY a.id DESC
    """)
    Page<ActividadeProjection> search(
            @Param("tipoEvento") ActividadeType tipoEvento,
            @Param("publicoAlvo") PublicoAlvoType publicoAlvo,
            @Param("duracao") DuracaoActividade duracao,
            @Param("q") String q,
            Pageable pageable);

    @Query("Select dataEvento from ActividadeModel")
     List<LocalDateTime> DatasMarcadas();
}
