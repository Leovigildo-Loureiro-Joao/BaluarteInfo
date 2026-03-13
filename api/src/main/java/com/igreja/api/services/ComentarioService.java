package com.igreja.api.services;

import java.time.LocalDate;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.comentario.Analise;
import com.igreja.api.dto.comentario.ComentarioDto;
import com.igreja.api.dto.comentario.ComentarioResult;
import com.igreja.api.enums.ComentarioType;
import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.ArtigoModel;
import com.igreja.api.models.ComentarioModel;
import com.igreja.api.models.MidiaModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.repositories.ActividadeRepository;
import com.igreja.api.repositories.ArtigosRepository;
import com.igreja.api.repositories.ComentarioRepository;
import com.igreja.api.repositories.MidiaRepository;
import com.igreja.api.repositories.UserRepository;

import jakarta.validation.Valid;

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

    public ComentarioResult save(ComentarioDto dto){
        UserModel user=userRepository.findById(dto.idUser()).orElseThrow(()-> new NoSuchElementException("Este user mão existe verifique se o id esta correto"));
        ComentarioModel comentario= new ComentarioModel();
        ////System.out.println("Cheguei aqui");
        var seccao=Seccao(dto).orElseThrow(()-> new NoSuchElementException("Este dado ja foi eliminado da base de dados"));
        BeanUtils.copyProperties(dto, comentario);
        comentario.setUser(user);
        comentario.setDataPublicacao(LocalDate.now());
        comentario=swSeccao(comentario,seccao);
         ////System.out.println("Terminei aqui"+comentario);
         //Object[] c=comentarioRepository.Result(comentarioRepository.save(comentario).getId());

        return comentarioRepository.result(comentarioRepository.save(comentario).getId());
    }

    private ComentarioModel swSeccao(ComentarioModel comentario,Object seccao){
        if (seccao instanceof ArtigoModel) {
            comentario.setArtigo((ArtigoModel) seccao);
            return comentario;
        } else  if (seccao instanceof ActividadeModel) {
            comentario.setActividade((ActividadeModel) seccao);
            return comentario;
        } else if (seccao instanceof MidiaModel) {
            comentario.setMidia((MidiaModel) seccao);
            return comentario;
        } else {
            throw new IllegalArgumentException("Seccão invalida");
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

    public ComentarioDto Select(int id,ComentarioType seccao)  {
        ComentarioModel comment= findByid(id);
        return new ComentarioDto(comment.getUser().getId(), id, seccao, comment.getDescricao());
     }

    public ComentarioModel findByid(int id)  {
        return comentarioRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Lamentamos mas este comentario não existe na base dados"));
     }

    public ComentarioModel edit(ComentarioDto dto,int id){
        ComentarioModel comentario=findByid(id);
        BeanUtils.copyProperties(dto, comentario);
        comentario.setDataPublicacao(LocalDate.now());
        return comentarioRepository.save(comentario);
    }

    public void delete(int id){
        ComentarioModel comentario=findByid(id);
        comentarioRepository.delete(comentario);
    }

    public ComentarioDto analise(Analise analise) {
        ComentarioModel comentario=findByid(analise.id());
        BeanUtils.copyProperties(analise, comentario);
        comentario.setDataPublicacao(LocalDate.now());
        comentarioRepository.save(comentario);
        return Select(analise.id(), ComentarioType.Actividade);
    }

    public Page<ComentarioResult> page(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("dataPublicacao").descending());
        return comentarioRepository.findAllByOrderByDataPublicacaoDesc(pageable)
                .map(this::toResult);
    }

    private ComentarioResult toResult(ComentarioModel model) {
        return new ComentarioResult(
                model.getId(),
                model.getUser() == null ? "" : model.getUser().getImg(),
                model.getUser() == null ? "" : model.getUser().getNome(),
                model.getDescricao(),
                model.isAnalise(),
                model.getDataPublicacao());
    }
    
}
