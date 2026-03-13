package com.igreja.api.services;
import com.igreja.api.dto.inscrito.*;
import com.igreja.api.dto.midia.MidiaActividade;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.actividade.ActividadeDto;
import com.igreja.api.dto.comentario.ComentarioResult;
import com.igreja.api.dto.PageResponse;
import com.igreja.api.enums.ActividadeType;
import com.igreja.api.enums.PublicoAlvoType;
import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.ArtigoModel;
import com.igreja.api.models.ComentarioModel;
import com.igreja.api.models.InscritosModel;
import com.igreja.api.models.MidiaModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.projection.ActividadeProjection;
import com.igreja.api.repositories.ActividadeRepository;
import com.igreja.api.repositories.ComentarioRepository;
import com.igreja.api.repositories.InscritosRepository;
import com.igreja.api.repositories.MidiaRepository;

import jakarta.validation.Valid;

@Service
public class ActividadeService {
    
    @Autowired
    private ActividadeRepository actividadeRepository;

    @Autowired
    private ComentarioRepository comentarioRepository;

     @Autowired
    private InscritosRepository inscritosRepository;

        @Autowired
    public MidiaRepository midiaRepository;

    @Autowired
    private CloudDinaryService upload;

     public ActividadeModel save(ActividadeDto actividade) throws IOException, InterruptedException, ExecutionException, TimeoutException {
        if (actividade.dataEvento().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("A data do evento não pode ser no passado");
        }
        upload.generateUniqueName(actividade.img().getOriginalFilename());
        ActividadeModel actividadeActual=new ActividadeModel();
        actividadeActual.setImg(upload.uploadFileAsync(actividade.img(),"image"));
        actividadeActual.setDataPublicacao(LocalDateTime.now());
        BeanUtils.copyProperties(actividade,actividadeActual);
        return actividadeRepository.save(actividadeActual);
     }

     public ActividadeModel edit(int id,ActividadeDto actividade) throws InternalError, IOException, InterruptedException, ExecutionException, TimeoutException {
        ActividadeModel actividadeActual=Select(id);
        actividadeActual.setDataPublicacao(LocalDateTime.now());
        BeanUtils.copyProperties(actividade, actividadeActual);
        if (!actividade.img().isEmpty()) {
            if (DeleteFile(actividadeActual.getImg())) {
                actividadeActual.setImg(upload.uploadFileAsync(actividade.img(),"image"));
            }
        }
        return actividadeRepository.save(actividadeActual); 
   }

   public ActividadeModel Select(int id)  {
      return actividadeRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Lamentamos mas este actividade não existe na base dados"));
   }

   public boolean DeleteFile(String url) throws IOException {
      // Excluir os arquivos da nuvem
      boolean pdfDeleted = upload.deleteFileAsync(url).join();
      return pdfDeleted;
  }

  public List<ComentarioResult> ComentariosAll(int id) {
      List<ComentarioResult> comentarios=new ArrayList<>();
      ActividadeModel artigo=Select(id);
      for (ComentarioModel comentario : comentarioRepository.findByActividade(artigo)) {
      
        UserModel user=comentario.getUser();
        comentarios.add(new ComentarioResult(
                comentario.getId(),
                user.getImg(),
                user.getNome(),
                comentario.getDescricao(),
                comentario.isAnalise(),
                comentario.getDataPublicacao()));    
      
        
      }
      return comentarios;
   }

     public List<ComentarioResult> ComentariosAllAnalisados(int id,boolean analise) {
      List<ComentarioResult> comentarios=new ArrayList<>();
      ActividadeModel artigo=Select(id);
      for (ComentarioModel comentario : comentarioRepository.findByActividade(artigo)) {
        if (comentario.isAnalise()==analise) {
            UserModel user=comentario.getUser();
            comentarios.add(new ComentarioResult(
                    comentario.getId(),
                    user.getImg(),
                    user.getNome(),
                    comentario.getDescricao(),
                    comentario.isAnalise(),
                    comentario.getDataPublicacao()));    
        }
        
      }
      return comentarios;
   }
  
    public PageResponse<InscritosData> InscritosAll(int id, int page, int size) {
      ActividadeModel actividadeModel=Select(id);
      var pageable = PageRequest.of(page, size);
      var result = inscritosRepository.findByActividade(actividadeModel, pageable)
              .map(inscrito -> {
                UserModel user=inscrito.getUser();
                return new InscritosData(user.getId(), actividadeModel.getTitulo(), actividadeModel.getTema(),
                        actividadeModel.getDataEvento(),inscrito.getStatus());
              });
      return new PageResponse<>(result.getContent(), result.getNumber(), result.getSize(),
              result.getTotalElements(), result.getTotalPages());
   }


    public boolean delete(int id) throws InternalError, IOException {
        ActividadeModel actividade= Select(id);
        if (DeleteFile(actividade.getImg())) {
            actividadeRepository.delete(actividade);   
            return true;
        }
        throw new InternalError("A processo não foi realizado");
   }

    public List<ActividadeModel> AllData() {
        return actividadeRepository.findAll();
    }

    public PageResponse<ActividadeProjection> page(int page, int size,
            ActividadeType tipoEvento,
            PublicoAlvoType publicoAlvo,
            com.igreja.api.enums.DuracaoActividade duracao,
            String q) {
        String search = (q == null || q.isBlank()) ? null : q;
        var pageable = PageRequest.of(page, size);
        var result = actividadeRepository.search(tipoEvento, publicoAlvo, duracao, search, pageable);
        return new PageResponse<>(result.getContent(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages());
    }

    public List<LocalDateTime> AllDataActividade() {
        return actividadeRepository.DatasMarcadas();
    }

    
   

}
