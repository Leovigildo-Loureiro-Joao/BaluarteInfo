package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.ActividadeModel;

public interface ActividadeRepository extends JpaRepository<ActividadeModel,Integer>{
    
}
