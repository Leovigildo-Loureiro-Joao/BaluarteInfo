package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.ArtigoModel;
import com.igreja.api.models.MidiaModel;
import com.igreja.api.models.VistosModel;
import java.util.List;


public interface VistosRepository extends JpaRepository<VistosModel,Integer> {
    List<VistosModel> findByArtigo(ArtigoModel artigo);
    List<VistosModel> findByMidia(MidiaModel midia);
}
