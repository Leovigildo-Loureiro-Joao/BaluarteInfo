package com.igreja.api.services;

import java.time.LocalDate;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.comentario.ComentarioDto;
import com.igreja.api.models.ArtigoModel;
import com.igreja.api.models.ComentarioModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.repositories.ActividadeRepository;
import com.igreja.api.repositories.ArtigosRepository;
import com.igreja.api.repositories.ComentarioRepository;
import com.igreja.api.repositories.MidiaRepository;
import com.igreja.api.repositories.UserRepository;

@Service
public class ComentarioService {
    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActividadeRepository actividadeRepository;

    @Autowired
    private MidiaRepository midiaRepository;

    @Autowired
    private ArtigosRepository artigosRepository;

    public ComentarioModel save(ComentarioDto dto){
        UserModel user=userRepository.findById(dto.idUser()).orElseThrow(()-> new NoSuchElementException("Este user mão existe verifique se o id esta correto"));
        ComentarioModel comentario= new ComentarioModel();
        var seccao=Seccao(dto).orElseThrow(()-> new NoSuchElementException("Este dado ja foi eliminado da base de dados"));
        BeanUtils.copyProperties(dto, comentario);
        comentario.setUser(user);
        comentario.setDataPublicacao(LocalDate.now());
        comentario=swSeccao(comentario,seccao);
        return comentarioRepository.save(comentario);
    }

    private ComentarioModel swSeccao(ComentarioModel comentario,Object seccao){
        if (seccao instanceof ArtigoModel) {
            comentario.setArtigo((ArtigoModel) seccao);
            return comentario;
        } else {
            return null;
        }
    }

    public Optional<?> Seccao(ComentarioDto dto){
        switch (dto.seccao()) {
            case Actividade:
                return actividadeRepository.findById(dto.idSeccao());
            case Midia:
                return midiaRepository.findById(dto.idSeccao());
            default:
                return artigosRepository.findById(dto.idSeccao());
        }
    } 

    public ComentarioModel Select(int id)  {
        return comentarioRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Lamentamos mas este comentario não existe na base dados"));
     }

    public ComentarioModel edit(ComentarioDto dto,int id){
        ComentarioModel comentario=Select(id);
        BeanUtils.copyProperties(dto, comentario);
        comentario.setDataPublicacao(LocalDate.now());
        return comentarioRepository.save(comentario);
    }

    public void delete(int id){
        ComentarioModel comentario=Select(id);
        comentarioRepository.delete(comentario);
    }
    
}
