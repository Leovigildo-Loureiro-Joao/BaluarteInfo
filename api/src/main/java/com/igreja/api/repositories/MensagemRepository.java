package com.igreja.api.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.MensagensModel;


import com.igreja.api.enums.MensagemType;
import com.igreja.api.enums.StatusMensage;


public interface MensagemRepository extends JpaRepository<MensagensModel,Integer>{
    Page<MensagensModel> findByTipo(MensagemType tipo, Pageable pageable);

    Page<MensagensModel> findByStatus(StatusMensage status, Pageable pageable);

    Page<MensagensModel> findByLido(boolean lido, Pageable pageable);

    Page<MensagensModel> findByTipoAndLido(MensagemType tipo, boolean lido, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("""
        SELECT m FROM MensagensModel m
        WHERE (m.email = :email OR m.destino = :email)
          AND (:tipo IS NULL OR m.tipo = :tipo)
          AND (:lido IS NULL OR m.lido = :lido)
        ORDER BY m.dataPublicacao DESC
    """)
    Page<MensagensModel> findByUserEmail(
            @org.springframework.data.repository.query.Param("email") String email,
            @org.springframework.data.repository.query.Param("tipo") MensagemType tipo,
            @org.springframework.data.repository.query.Param("lido") Boolean lido,
            Pageable pageable);
}
