package com.igreja.api.services;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.actividade.ActividadeDto;
import com.igreja.api.dto.comentario.ComentarioResult;
import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.ArtigosModel;
import com.igreja.api.models.ComentarioModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.repositories.ActividadeRepository;

@Service
public class ActividadeService {
    
    @Autowired
    private ActividadeRepository actividadeRepository;

    @Autowired
    private CloudDinaryService upload;

     public ActividadeModel save(ActividadeDto actividade) throws IOException {
        upload.GerarName(actividade.img());
        upload.uploadFile(actividade.img(),"image");
        ActividadeModel actividadeActual=new ActividadeModel();
        actividadeActual.setImg(upload.getUrl());
        actividadeActual.setDataPublicacao(LocalDateTime.now());
        BeanUtils.copyProperties(actividade,actividadeActual);
        return actividadeRepository.save(actividadeActual);
     }

     public ActividadeModel edit(int id,ActividadeDto actividade) throws InternalError, IOException {
        ActividadeModel actividadeActual=Select(id);
        actividadeActual.setDataPublicacao(LocalDateTime.now());
        BeanUtils.copyProperties(actividade, actividadeActual);
        if (!actividade.img().isEmpty()) {
            if (DeleteFile(actividadeActual.getImg())) {
                upload.GerarName(actividade.img());
                upload.uploadFile(actividade.img(),"image");
                actividadeActual.setImg(upload.getUrl());
            }
        }
        return actividadeRepository.save(actividadeActual); 
   }

   public ActividadeModel Select(int id)  {
      return actividadeRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Lamentamos mas este actividade não existe na base dados"));
   }

   public boolean DeleteFile(String url) throws IOException {
      // Excluir os arquivos da nuvem
      boolean pdfDeleted = upload.deleteFile(url);
      return pdfDeleted;
  }

  public List<ComentarioResult> ComentariosAll(int id) {
      List<ComentarioResult> comentarios=new ArrayList<>();
      ActividadeModel artigo=Select(id);
      for (ComentarioModel comentario : artigo.getComentarios()) {
         UserModel user=comentario.getUser();
         comentarios.add(new ComentarioResult(user.getImg(), user.getUsername(), comentario.getDescricao()));
      }
      return comentarios;
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

   

}
