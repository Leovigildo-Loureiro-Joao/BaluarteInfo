package com.igreja.api.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.igreja.api.dto.midia.AudioDto;
import com.igreja.api.dto.midia.VideoDto;
import com.igreja.api.models.MidiaModel;

public interface MidiaRepository extends JpaRepository<MidiaModel,Integer>{

    @Query("SELECT descricao,url from MidiaModel where type='VIDEO'")
    public List<VideoDto> VideosAll();

    @Query("SELECT titulo,descricao,imagem,url from MidiaModel where type='AUDIO'")
    public List<AudioDto> AudioAll();
}
