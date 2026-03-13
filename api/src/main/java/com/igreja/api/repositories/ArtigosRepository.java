package com.igreja.api.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.igreja.api.models.ArtigoModel;
import com.igreja.api.projection.ArtigoDetailProjection;
import com.igreja.api.projection.ArtigoProjection;

public interface ArtigosRepository extends JpaRepository<ArtigoModel,Integer>{
   
    @Query(
        value = """
            SELECT
                a.id as id,
                a.titulo as titulo,
                a.descricao as descricao,
                a.tipo as tipo,
                a.escritor as escritor,
                a.pdf as pdf,
                a.nPagina as nPagina,
                a.dataPublicacao as dataPublicacao,
                a.img as img,
                (SELECT COUNT(v) FROM VistosModel v WHERE v.artigo = a) as visualizacoes,
                (SELECT COUNT(c) FROM ComentarioModel c WHERE c.artigo = a) as comentarios
            FROM ArtigoModel a
            ORDER BY a.id DESC
        """,
        countQuery = "SELECT COUNT(a) FROM ArtigoModel a"
    )
    public Page<ArtigoProjection> findAllByOrderByIdDesc(Pageable pageable);

    @Query(
        value = """
            SELECT
                a.id as id,
                a.titulo as titulo,
                a.descricao as descricao,
                a.tipo as tipo,
                a.escritor as escritor,
                a.pdf as pdf,
                a.nPagina as nPagina,
                a.dataPublicacao as dataPublicacao,
                a.img as img,
                (SELECT COUNT(v) FROM VistosModel v WHERE v.artigo = a) as visualizacoes,
                (SELECT COUNT(c) FROM ComentarioModel c WHERE c.artigo = a) as comentarios
            FROM ArtigoModel a
            WHERE (:tipo IS NULL OR a.tipo = :tipo)
              AND (:q IS NULL OR LOWER(a.titulo) LIKE LOWER(CONCAT('%', :q, '%'))
                            OR LOWER(a.descricao) LIKE LOWER(CONCAT('%', :q, '%')))
            ORDER BY a.id DESC
        """,
        countQuery = """
            SELECT COUNT(a)
            FROM ArtigoModel a
            WHERE (:tipo IS NULL OR a.tipo = :tipo)
              AND (:q IS NULL OR LOWER(a.titulo) LIKE LOWER(CONCAT('%', :q, '%'))
                            OR LOWER(a.descricao) LIKE LOWER(CONCAT('%', :q, '%')))
        """
    )
    Page<ArtigoProjection> search(
            @Param("tipo") com.igreja.api.enums.ArtigoType tipo,
            @Param("q") String q,
            Pageable pageable);

    @Query("""
        SELECT
            a.id as id,
            a.titulo as titulo,
            a.descricao as descricao,
            a.conteudo as conteudo,
            a.tipo as tipo,
            a.escritor as escritor,
            a.pdf as pdf,
            a.nPagina as nPagina,
            a.dataPublicacao as dataPublicacao,
            a.img as img,
            (SELECT COUNT(v) FROM VistosModel v WHERE v.artigo = a) as visualizacoes,
            (SELECT COUNT(c) FROM ComentarioModel c WHERE c.artigo = a) as comentarios
        FROM ArtigoModel a
        WHERE a.id = :id
    """)
    Optional<ArtigoDetailProjection> findDetailById(@Param("id") int id);
}
