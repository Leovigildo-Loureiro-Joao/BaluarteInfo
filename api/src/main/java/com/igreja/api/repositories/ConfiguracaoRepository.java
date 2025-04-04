package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.ConfiguracaoModel;

public interface ConfiguracaoRepository extends JpaRepository<ConfiguracaoModel,Integer>{
    
}
