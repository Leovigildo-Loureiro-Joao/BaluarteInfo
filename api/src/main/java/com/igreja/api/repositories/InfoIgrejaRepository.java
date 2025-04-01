package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.InfoIgrejaModel;
import java.util.List;
import java.util.Optional;

import com.igreja.api.enums.InfoType;


public interface InfoIgrejaRepository extends JpaRepository<InfoIgrejaModel,Integer>{
    Optional<InfoIgrejaModel> findByType(InfoType type);
}
