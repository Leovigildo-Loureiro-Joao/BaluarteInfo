package com.igreja.api.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.NotificacaoModel;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;


public interface NotificacaoRepository extends JpaRepository<NotificacaoModel,Integer> {
    Page<NotificacaoModel> findByLido(boolean lido, Pageable pageable);

    Optional<NotificacaoModel> findByDescricao(String descricao);

    Optional<NotificacaoModel> findByRefKey(String refKey);

    boolean existsByRefKey(String refKey);

    long deleteByLidoIsTrueAndDataNotificacaoBefore(LocalDateTime cutoff);
}
