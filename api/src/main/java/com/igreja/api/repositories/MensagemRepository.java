package com.igreja.api.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.MensagensModel;


import java.util.List;
import com.igreja.api.enums.MensagemType;
import com.igreja.api.enums.StatusMensage;


public interface MensagemRepository extends JpaRepository<MensagensModel,Integer>{
    Page<MensagensModel> findByAll(Pageable pageable);
    Page<MensagensModel> findByTipo(MensagemType tipo, Pageable pageable);

    Page<MensagensModel> findByStatus(StatusMensage status, Pageable pageable);
}
