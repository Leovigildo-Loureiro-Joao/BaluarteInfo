package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.ComentarioModel;

public interface ComentarioRepository extends JpaRepository<ComentarioModel,Integer>{
    
}
