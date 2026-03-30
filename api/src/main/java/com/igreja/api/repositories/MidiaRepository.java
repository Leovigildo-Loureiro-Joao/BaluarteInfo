package com.igreja.api.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.igreja.api.dto.midia.GaleriaAdminItem;
import com.igreja.api.enums.AudioType;
import com.igreja.api.enums.MidiaType;
import com.igreja.api.enums.VideoType;
import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.MidiaModel;
import com.igreja.api.projection.midia.AudioProjection;
import com.igreja.api.projection.midia.MidiaProjection;
import com.igreja.api.projection.midia.VideoProjection;


public interface MidiaRepository extends JpaRepository<MidiaModel,Integer>{
    long countByType(MidiaType type);

    @Query(
        value = """
            SELECT
                m.id as id,
                m.descricao as descricao,
                m.titulo as titulo,
                m.autor as autor,
                m.url as url,
                m.videoType as videoType,
                (SELECT COUNT(v) FROM VistosModel v WHERE v.midia = m) as visualizacoes
            FROM MidiaModel m
            WHERE m.type = :type
            ORDER BY m.id DESC
        """,
        countQuery = "SELECT COUNT(m) FROM MidiaModel m WHERE m.type = :type"
    )
    Page<VideoProjection> findAllVideoByTypeOrderByIdDesc(@Param("type") MidiaType type, Pageable pageable);

    List<MidiaModel> findByActividade(ActividadeModel actividade);
    Page<MidiaModel> findByActividade(ActividadeModel actividade, Pageable pageable);
    Page<MidiaModel> findByActividadeAndType(ActividadeModel actividade, MidiaType type, Pageable pageable);
    Page<MidiaModel> findByActividadeAndTypeAndIdNot(ActividadeModel actividade, MidiaType type, int id, Pageable pageable);

    Page<MidiaModel> findByTypeOrderByIdDesc(MidiaType type, Pageable pageable);
    Page<MidiaModel> findByAutorIgnoreCaseAndTypeAndIdNotOrderByIdDesc(String autor, MidiaType type, int id, Pageable pageable);

    Page<MidiaModel> findByAudioTypeAndIdNotOrderByIdDesc(AudioType audioType, int id, Pageable pageable);
    Page<MidiaModel> findByVideoTypeAndIdNotOrderByIdDesc(VideoType videoType, int id, Pageable pageable);

    @Query("""
        SELECT m
        FROM MidiaModel m
        JOIN m.actividade a
        WHERE LOWER(a.titulo) = LOWER(:titulo)
          AND m.type = :type
          AND m.id <> :midiaId
        ORDER BY COALESCE(a.edicao, 0) DESC, a.dataEvento DESC, m.id DESC
    """)
    Page<MidiaModel> findRelacionadosPorEdicoes(
            @Param("titulo") String titulo,
            @Param("type") MidiaType type,
            @Param("midiaId") int midiaId,
            Pageable pageable);

    @Query(
        value = """
            SELECT
                m.id as id,
                m.titulo as titulo,
                m.descricao as descricao,
                m.imagem as imagem,
                m.tempo as tempo,
                m.autor as autor,
                m.audioType as audioType,
                m.url as url,
                (SELECT COUNT(v) FROM VistosModel v WHERE v.midia = m) as visualizacoes
            FROM MidiaModel m
            WHERE m.type = :type
            ORDER BY m.id DESC
        """,
        countQuery = "SELECT COUNT(m) FROM MidiaModel m WHERE m.type = :type"
    )
    Page<AudioProjection> findAllAudioByTypeOrderByIdDesc(@Param("type") MidiaType type, Pageable pageable);

    @Query(
        value = """
            SELECT
                m.id as id,
                m.titulo as titulo,
                m.descricao as descricao,
                m.imagem as imagem,
                m.tempo as tempo,
                m.autor as autor,
                m.type as type,
                m.audioType as audioType,
                m.videoType as videoType,
                m.url as url,
                (SELECT COUNT(v) FROM VistosModel v WHERE v.midia = m) as visualizacoes
            FROM MidiaModel m
            ORDER BY m.id DESC
        """,
        countQuery = "SELECT COUNT(m) FROM MidiaModel m"
    )
    Page<MidiaProjection> findAllByOrderByIdDesc(Pageable pageable);

    @Query(
        value = """
            SELECT
                m.id as id,
                m.titulo as titulo,
                m.descricao as descricao,
                m.imagem as imagem,
                m.tempo as tempo,
                m.autor as autor,
                m.type as type,
                m.audioType as audioType,
                m.videoType as videoType,
                m.url as url,
                (SELECT COUNT(v) FROM VistosModel v WHERE v.midia = m) as visualizacoes
            FROM MidiaModel m
            WHERE (:type IS NULL OR m.type = :type)
              AND (:audioType IS NULL OR m.audioType = :audioType)
              AND (:videoType IS NULL OR m.videoType = :videoType)
              AND (:q IS NULL OR LOWER(m.titulo) LIKE LOWER(CONCAT('%', :q, '%'))
                            OR LOWER(m.descricao) LIKE LOWER(CONCAT('%', :q, '%')))
            ORDER BY m.id DESC
        """,
        countQuery = """
            SELECT COUNT(m)
            FROM MidiaModel m
            WHERE (:type IS NULL OR m.type = :type)
              AND (:audioType IS NULL OR m.audioType = :audioType)
              AND (:videoType IS NULL OR m.videoType = :videoType)
              AND (:q IS NULL OR LOWER(m.titulo) LIKE LOWER(CONCAT('%', :q, '%'))
                            OR LOWER(m.descricao) LIKE LOWER(CONCAT('%', :q, '%')))
        """
    )
    Page<MidiaProjection> search(
            @Param("type") MidiaType type,
            @Param("audioType") com.igreja.api.enums.AudioType audioType,
            @Param("videoType") com.igreja.api.enums.VideoType videoType,
            @Param("q") String q,
            Pageable pageable);

    @Query("""
        SELECT new com.igreja.api.dto.midia.GaleriaAdminItem(
            m.id,
            m.url,
            m.titulo,
            m.descricao,
            m.dataPublicacao,
            a.id,
            a.titulo,
            (SELECT COUNT(v) FROM VistosModel v WHERE v.midia = m)
        )
        FROM MidiaModel m
        LEFT JOIN m.actividade a
        WHERE m.type = :type
          AND (:q IS NULL OR LOWER(m.titulo) LIKE LOWER(CONCAT('%', :q, '%'))
                        OR LOWER(m.descricao) LIKE LOWER(CONCAT('%', :q, '%')))
        ORDER BY m.id DESC
    """)
    Page<GaleriaAdminItem> findGaleriaAdmin(
            @Param("type") MidiaType type,
            @Param("q") String q,
            Pageable pageable);
}
