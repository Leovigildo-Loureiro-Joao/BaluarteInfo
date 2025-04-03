package com.igreja.api.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.comentario.ComentarioResult;
import com.igreja.api.dto.midia.MidiaDto;
import com.igreja.api.models.ComentarioModel;
import com.igreja.api.models.MidiaModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.repositories.MidiaRepository;

@Service
public class MidiaService {

    public MidiaRepository midiaRepository;
    
    public MidiaModel save(MidiaDto midiaDto) { 
        MidiaModel midia= new MidiaModel();
        midia.setDataPublicacao(LocalDate.now());
        BeanUtils.copyProperties(midiaDto, midia);
        return midiaRepository.save(midia);
    }

    public MidiaModel Select(int id)  {
        return midiaRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Lamentamos mas esta midia não existe na base dados"));
     }

    public MidiaModel edit(MidiaDto dto,int id){
        MidiaModel midia=Select(id);
        BeanUtils.copyProperties(dto, midia);
        midia.setDataPublicacao(LocalDate.now());
        return midiaRepository.save(midia);
    }

    public void delete(int id){
        MidiaModel midia=Select(id);
        midiaRepository.delete(midia);
    }

    public List<MidiaModel> AllData() {
      return midiaRepository.findAll();
    }
   

    public List<ComentarioResult> ComentariosAll(int id) {
        List<ComentarioResult> comentarios=new ArrayList<>();
        MidiaModel artigo=Select(id);
        for (ComentarioModel comentario : artigo.getComentarios()) {
            UserModel user=comentario.getUser();
            comentarios.add(new ComentarioResult(user.getImg(), user.getUsername(), comentario.getDescricao()));
        }
        return comentarios;
    }
}
