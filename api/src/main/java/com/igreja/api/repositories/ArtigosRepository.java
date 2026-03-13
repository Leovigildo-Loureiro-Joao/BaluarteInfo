package com.igreja.api.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.igreja.api.models.ArtigoModel;
import com.igreja.api.projection.ArtigoProjection;

public interface ArtigosRepository extends JpaRepository<ArtigoModel,Integer>{
   
    public Page<ArtigoProjection> findAllByOrderByIdDesc(Pageable pageable);

    @Query("""
        SELECT a FROM ArtigoModel a
        WHERE (:tipo IS NULL OR a.tipo = :tipo)
          AND (:q IS NULL OR LOWER(a.titulo) LIKE LOWER(CONCAT('%', :q, '%'))
                        OR LOWER(a.descricao) LIKE LOWER(CONCAT('%', :q, '%')))
        ORDER BY a.id DESC
    """)
    Page<ArtigoProjection> search(
            @Param("tipo") com.igreja.api.enums.ArtigoType tipo,
            @Param("q") String q,
            Pageable pageable);
}
