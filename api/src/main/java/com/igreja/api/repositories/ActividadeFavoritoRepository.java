package com.igreja.api.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.igreja.api.models.ActividadeFavoritoModel;
import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.projection.ActividadeProjection;

public interface ActividadeFavoritoRepository extends JpaRepository<ActividadeFavoritoModel, Long> {

    Optional<ActividadeFavoritoModel> findByActividadeAndUser(ActividadeModel actividade, UserModel user);

    boolean existsByActividadeAndUser(ActividadeModel actividade, UserModel user);

    void deleteByActividadeAndUser(ActividadeModel actividade, UserModel user);

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
                a.palestrantes as palestrantes,
                a.edicao as edicao,
                a.dataEvento as dataEvento,
                a.dataPublicacao as dataPublicacao,
                a.contactos as contactos,
                a.img as img,
                a.capacidade as capacidade,
                (SELECT COUNT(i) FROM InscritosModel i WHERE i.actividade = a) as inscritos
            FROM ActividadeFavoritoModel f
            JOIN f.actividade a
            WHERE f.user.id = :userId
            ORDER BY f.dataFavorito DESC
        """,
        countQuery = """
            SELECT COUNT(f)
            FROM ActividadeFavoritoModel f
            WHERE f.user.id = :userId
        """
    )
    Page<ActividadeProjection> pageFavoritosByUserId(@Param("userId") long userId, Pageable pageable);
}

