package com.igreja.api.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.igreja.api.dto.actividade.ActividadeDto;
import com.igreja.api.models.ActividadeModel;

import com.igreja.api.projection.ActividadeProjection;

public interface ActividadeRepository extends JpaRepository<ActividadeModel,Integer>{
    
     Page<ActividadeProjection> findAllByOrderByIdDesc(Pageable pageable);

    @Query("Select dataEvento from ActividadeModel")
     List<LocalDateTime> DatasMarcadas();
}
