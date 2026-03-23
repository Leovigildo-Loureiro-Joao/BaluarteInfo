package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.ArtigoModel;
import com.igreja.api.models.MidiaModel;
import com.igreja.api.models.VistosModel;
import java.util.List;
import java.time.LocalDateTime;


public interface VistosRepository extends JpaRepository<VistosModel,Integer> {
    List<VistosModel> findByArtigo(ArtigoModel artigo);
    List<VistosModel> findByMidia(MidiaModel midia);
    long countByMidia(MidiaModel midia);
    long countByArtigo(ArtigoModel artigo);
    boolean existsByMidiaAndIpAndDataAfter(MidiaModel midia, String ip, LocalDateTime data);
}
