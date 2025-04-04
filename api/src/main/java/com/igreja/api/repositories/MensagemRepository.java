package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.MensagensModel;
import java.util.List;
import com.igreja.api.enums.MensagemType;


public interface MensagemRepository extends JpaRepository<MensagensModel,Integer>{
    List<MensagensModel> findByTipo(MensagemType tipo);
}
