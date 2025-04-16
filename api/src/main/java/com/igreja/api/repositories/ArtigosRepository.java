package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.ArtigosModel;

public interface ArtigosRepository extends JpaRepository<ArtigosModel,Integer>{
    
}
