package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.MidiaModel;

public interface MidiaRepository extends JpaRepository<MidiaModel,Integer>{
    
}
