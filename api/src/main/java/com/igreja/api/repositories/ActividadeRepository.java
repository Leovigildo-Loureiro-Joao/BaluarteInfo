package com.igreja.api.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
    
     @Query(
        value = """
            SELECT
                a.id as id,
                a.descricao as descricao,
                a.tema as tema,
                a.titulo as titulo,
                a.endereco as endereco,
                a.tipoEvento as tipoEvento,
                a.duracao as duracao,
                a.publicoAlvo as publicoAlvo,
                a.organizador as organizador,
                a.edicao as edicao,
                a.dataEvento as dataEvento,
                a.dataPublicacao as dataPublicacao,
                a.contactos as contactos,
                a.img as img,
                a.capacidade as capacidade,
                (SELECT COUNT(i) FROM InscritosModel i WHERE i.actividade = a) as inscritos
            FROM ActividadeModel a
            ORDER BY a.id DESC
        """,
        countQuery = "SELECT COUNT(a) FROM ActividadeModel a"
    )
     Page<ActividadeProjection> findAllByOrderByIdDesc(Pageable pageable);

    @Query(
        value = """
            SELECT
                a.id as id,
                a.descricao as descricao,
                a.tema as tema,
                a.titulo as titulo,
                a.endereco as endereco,
                a.tipoEvento as tipoEvento,
                a.duracao as duracao,
                a.publicoAlvo as publicoAlvo,
                a.organizador as organizador,
                a.edicao as edicao,
                a.dataEvento as dataEvento,
                a.dataPublicacao as dataPublicacao,
                a.contactos as contactos,
                a.img as img,
                a.capacidade as capacidade,
                (SELECT COUNT(i) FROM InscritosModel i WHERE i.actividade = a) as inscritos
            FROM ActividadeModel a
            WHERE (:tipoEvento IS NULL OR a.tipoEvento = :tipoEvento)
              AND (:publicoAlvo IS NULL OR a.publicoAlvo = :publicoAlvo)
              AND (:duracao IS NULL OR a.duracao = :duracao)
              AND (:q IS NULL OR LOWER(a.titulo) LIKE LOWER(CONCAT('%', :q, '%'))
                            OR LOWER(a.tema) LIKE LOWER(CONCAT('%', :q, '%'))
                            OR LOWER(a.descricao) LIKE LOWER(CONCAT('%', :q, '%')))
            ORDER BY a.id DESC
        """,
        countQuery = """
            SELECT COUNT(a)
            FROM ActividadeModel a
            WHERE (:tipoEvento IS NULL OR a.tipoEvento = :tipoEvento)
              AND (:publicoAlvo IS NULL OR a.publicoAlvo = :publicoAlvo)
              AND (:duracao IS NULL OR a.duracao = :duracao)
              AND (:q IS NULL OR LOWER(a.titulo) LIKE LOWER(CONCAT('%', :q, '%'))
                            OR LOWER(a.tema) LIKE LOWER(CONCAT('%', :q, '%'))
                            OR LOWER(a.descricao) LIKE LOWER(CONCAT('%', :q, '%')))
        """
    )
    Page<ActividadeProjection> search(
            @Param("tipoEvento") ActividadeType tipoEvento,
            @Param("publicoAlvo") PublicoAlvoType publicoAlvo,
            @Param("duracao") DuracaoActividade duracao,
            @Param("q") String q,
            Pageable pageable);

    @Query("Select dataEvento from ActividadeModel")
     List<LocalDateTime> DatasMarcadas();

    @Query("""
        SELECT COALESCE(MAX(a.edicao), 0)
        FROM ActividadeModel a
        WHERE LOWER(a.titulo) = LOWER(:titulo)
    """)
    Integer findMaxEdicaoByTitulo(@Param("titulo") String titulo);

    @Query(
        value = """
            SELECT
                a.id as id,
                a.descricao as descricao,
                a.tema as tema,
                a.titulo as titulo,
                a.endereco as endereco,
                a.tipoEvento as tipoEvento,
                a.duracao as duracao,
                a.publicoAlvo as publicoAlvo,
                a.organizador as organizador,
                a.edicao as edicao,
                a.dataEvento as dataEvento,
                a.dataPublicacao as dataPublicacao,
                a.contactos as contactos,
                a.img as img,
                a.capacidade as capacidade,
                (SELECT COUNT(i) FROM InscritosModel i WHERE i.actividade = a) as inscritos
            FROM ActividadeModel a
            WHERE LOWER(a.titulo) = LOWER(:titulo)
              AND a.id <> :id
            ORDER BY COALESCE(a.edicao, 0) DESC, a.id DESC
        """,
        countQuery = """
            SELECT COUNT(a)
            FROM ActividadeModel a
            WHERE LOWER(a.titulo) = LOWER(:titulo)
              AND a.id <> :id
        """
    )
    Page<ActividadeProjection> findEdicoesByTitulo(
            @Param("titulo") String titulo,
            @Param("id") int id,
            Pageable pageable);

    @Query(
        value = """
            SELECT
                a.id as id,
                a.descricao as descricao,
                a.tema as tema,
                a.titulo as titulo,
                a.endereco as endereco,
                a.tipoEvento as tipoEvento,
                a.duracao as duracao,
                a.publicoAlvo as publicoAlvo,
                a.organizador as organizador,
                a.edicao as edicao,
                a.dataEvento as dataEvento,
                a.dataPublicacao as dataPublicacao,
                a.contactos as contactos,
                a.img as img,
                a.capacidade as capacidade,
                (SELECT COUNT(i) FROM InscritosModel i WHERE i.actividade = a) as inscritos
            FROM ActividadeModel a
            WHERE a.id = :id
        """
    )
    Optional<ActividadeProjection> findDetailById(@Param("id") int id);
}
