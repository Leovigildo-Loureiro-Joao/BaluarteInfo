package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.InscritosModel;

public interface InscritosRepository extends JpaRepository<InscritosModel, Long> {
    
}
