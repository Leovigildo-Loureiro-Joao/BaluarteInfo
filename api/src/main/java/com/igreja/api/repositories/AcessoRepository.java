package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.AcessoModel;

public interface AcessoRepository extends JpaRepository<AcessoModel,Long>{
    
}
