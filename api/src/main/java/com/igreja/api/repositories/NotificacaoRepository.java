package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.NotificacaoModel;
import java.util.List;
import java.util.Optional;


public interface NotificacaoRepository extends JpaRepository<NotificacaoModel,Integer> {
    List<NotificacaoModel> findByLido(boolean lido);

    Optional<NotificacaoModel> findByDescricao(String descricao);
}
