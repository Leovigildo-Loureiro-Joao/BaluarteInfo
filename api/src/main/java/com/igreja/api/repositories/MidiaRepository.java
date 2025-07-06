package com.igreja.api.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.igreja.api.enums.MidiaType;
import com.igreja.api.models.MidiaModel;
import com.igreja.api.projection.midia.AudioProjection;
import com.igreja.api.projection.midia.VideoProjection;


public interface MidiaRepository extends JpaRepository<MidiaModel,Integer>{

    Page<VideoProjection> findAllVideoByTypeOrderByIdDesc(MidiaType type, Pageable pageable);

    Page<AudioProjection> findAllAudioByTypeOrderByIdDesc(MidiaType type, Pageable pageable);
}
