package com.igreja.api.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.InscritosModel;
import com.igreja.api.models.UserModel;
import java.util.List;


public interface InscritosRepository extends JpaRepository<InscritosModel, Long> {
    List<InscritosModel> findByActividade(ActividadeModel actividade);
    long countByActividade(ActividadeModel actividade);
    Page<InscritosModel> findByActividade(ActividadeModel actividade, Pageable pageable);
    Page<InscritosModel> findByUser(UserModel user, Pageable pageable);
    Page<InscritosModel> findAll(Pageable pageable);
    
}
