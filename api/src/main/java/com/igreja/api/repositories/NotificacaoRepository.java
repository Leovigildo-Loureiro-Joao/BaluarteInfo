package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.NotificacaoModel;
import java.util.List;


public interface NotificacaoRepository extends JpaRepository<NotificacaoModel,Integer> {
    List<NotificacaoModel> findByLido(boolean lido);
}
