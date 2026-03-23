package com.igreja.api.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.igreja.api.models.ProgramacaoActividadeModel;

public interface ProgramacaoActividadeRepository extends JpaRepository<ProgramacaoActividadeModel, Integer> {
    @Query("""
            SELECT p
            FROM ProgramacaoActividadeModel p
            WHERE p.actividade.id = :actividadeId
            ORDER BY COALESCE(p.ordem, 2147483647) ASC, p.inicio ASC, p.id ASC
            """)
    List<ProgramacaoActividadeModel> findByActividadeOrder(@Param("actividadeId") int actividadeId);

    boolean existsByActividadeIdAndInicioAfter(int actividadeId, LocalDateTime inicio);
}

