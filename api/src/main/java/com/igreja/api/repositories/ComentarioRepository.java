package com.igreja.api.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.igreja.api.dto.comentario.ComentarioResult;
import com.igreja.api.enums.ComentarioStatus;
import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.ComentarioModel;
import com.igreja.api.models.UserModel;
import java.util.List;


public interface ComentarioRepository extends JpaRepository<ComentarioModel,Integer>{
    List<ComentarioModel> findByActividade(ActividadeModel actividade);
    Page<ComentarioModel> findAllByOrderByDataPublicacaoDesc(Pageable pageable);
    Page<ComentarioModel> findAllByStatusOrderByDataPublicacaoDesc(ComentarioStatus status, Pageable pageable);
    Page<ComentarioModel> findByUserOrderByDataPublicacaoDesc(UserModel user, Pageable pageable);

    @Query("""
        SELECT new com.igreja.api.dto.comentario.ComentarioResult(
            c.id,
            u.img,
            u.nome,
            c.descricao,
            c.analise,
            c.dataPublicacao,
            (SELECT COUNT(l) FROM ComentarioLikeModel l WHERE l.comentario = c)
        )
        FROM ComentarioModel c
        JOIN c.user u
        WHERE c.id = :id
    """)
    ComentarioResult result(@Param("id") int id);

}
