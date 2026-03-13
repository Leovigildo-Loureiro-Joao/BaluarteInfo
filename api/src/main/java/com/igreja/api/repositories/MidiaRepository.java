package com.igreja.api.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.igreja.api.enums.MidiaType;
import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.MidiaModel;
import com.igreja.api.projection.midia.AudioProjection;
import com.igreja.api.projection.midia.MidiaProjection;
import com.igreja.api.projection.midia.VideoProjection;


public interface MidiaRepository extends JpaRepository<MidiaModel,Integer>{

    Page<VideoProjection> findAllVideoByTypeOrderByIdDesc(MidiaType type, Pageable pageable);

    List<MidiaModel> findByActividade(ActividadeModel actividade);
    Page<MidiaModel> findByActividade(ActividadeModel actividade, Pageable pageable);
    Page<MidiaModel> findByActividadeAndType(ActividadeModel actividade, MidiaType type, Pageable pageable);

    Page<AudioProjection> findAllAudioByTypeOrderByIdDesc(MidiaType type, Pageable pageable);

    Page<MidiaProjection> findAllByOrderByIdDesc( Pageable pageable);

    @Query("""
        SELECT m FROM MidiaModel m
        WHERE (:type IS NULL OR m.type = :type)
          AND (:audioType IS NULL OR m.audioType = :audioType)
          AND (:videoType IS NULL OR m.videoType = :videoType)
          AND (:q IS NULL OR LOWER(m.titulo) LIKE LOWER(CONCAT('%', :q, '%'))
                        OR LOWER(m.descricao) LIKE LOWER(CONCAT('%', :q, '%')))
        ORDER BY m.id DESC
    """)
    Page<MidiaProjection> search(
            @Param("type") MidiaType type,
            @Param("audioType") com.igreja.api.enums.AudioType audioType,
            @Param("videoType") com.igreja.api.enums.VideoType videoType,
            @Param("q") String q,
            Pageable pageable);
}
