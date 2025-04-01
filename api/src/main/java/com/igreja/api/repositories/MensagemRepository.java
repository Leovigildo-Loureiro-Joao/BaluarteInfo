package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.MensagensModel;

public interface MensagemRepository extends JpaRepository<MensagensModel,Integer>{
    
}
