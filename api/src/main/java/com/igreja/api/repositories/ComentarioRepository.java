package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.ComentarioModel;
import java.util.List;


public interface ComentarioRepository extends JpaRepository<ComentarioModel,Integer>{
    List<ComentarioModel> findByActividade(ActividadeModel actividade);
}
