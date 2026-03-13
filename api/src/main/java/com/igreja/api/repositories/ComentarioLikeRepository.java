package com.igreja.api.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.ComentarioLikeModel;
import com.igreja.api.models.ComentarioModel;
import com.igreja.api.models.UserModel;

public interface ComentarioLikeRepository extends JpaRepository<ComentarioLikeModel, Long> {

    Optional<ComentarioLikeModel> findByComentarioAndUser(ComentarioModel comentario, UserModel user);

    long countByComentario(ComentarioModel comentario);

    void deleteByComentarioAndUser(ComentarioModel comentario, UserModel user);
}
