package com.igreja.api.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.NewlesterModel;

public interface NewlesterRepository extends JpaRepository<NewlesterModel,Long>{
    
    Optional<NewlesterModel> findByEmail(String email);
    List<NewlesterModel> findByNome(String nome);
    
}
