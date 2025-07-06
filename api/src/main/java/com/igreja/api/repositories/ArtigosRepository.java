package com.igreja.api.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.igreja.api.models.ArtigoModel;
import com.igreja.api.projection.ArtigoProjection;

public interface ArtigosRepository extends JpaRepository<ArtigoModel,Integer>{
   
    public Page<ArtigoProjection> findAllByOrderByIdDesc(Pageable pageable);
}
