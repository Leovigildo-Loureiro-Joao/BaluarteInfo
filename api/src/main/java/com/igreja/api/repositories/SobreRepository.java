package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.SobreModel;

public interface SobreRepository extends JpaRepository<SobreModel, Integer> {
}
