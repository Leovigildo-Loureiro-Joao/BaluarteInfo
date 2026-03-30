package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.SalvacaoModel;

public interface SalvacaoRepository extends JpaRepository<SalvacaoModel, Integer> {
}

