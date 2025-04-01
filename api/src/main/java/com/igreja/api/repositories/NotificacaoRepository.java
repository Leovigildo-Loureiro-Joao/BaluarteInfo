package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.NotificacaoModel;

public interface NotificacaoRepository extends JpaRepository<NotificacaoModel,Integer> {
    
}
