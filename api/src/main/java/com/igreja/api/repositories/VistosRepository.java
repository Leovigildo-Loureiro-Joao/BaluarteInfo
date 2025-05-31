package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.ArtigosModel;
import com.igreja.api.models.MidiaModel;
import com.igreja.api.models.VistosModel;
import java.util.List;


public interface VistosRepository extends JpaRepository<VistosModel,Integer> {
    List<VistosModel> findByArtigo(ArtigosModel artigo);
    List<VistosModel> findByMidia(MidiaModel midia);
}
