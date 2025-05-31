package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.ConfiguracaoModel;
import java.util.List;
import java.util.Optional;

import com.igreja.api.enums.ConfigType;


public interface ConfiguracaoRepository extends JpaRepository<ConfiguracaoModel,Integer>{
    Optional<ConfiguracaoModel> findByType(ConfigType type);
}
