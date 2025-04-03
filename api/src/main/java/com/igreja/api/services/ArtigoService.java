package com.igreja.api.services;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.ArtigoDto;
import com.igreja.api.dto.InfoDto;
import com.igreja.api.dto.comentario.ComentarioResult;
import com.igreja.api.models.ArtigosModel;
import com.igreja.api.models.ComentarioModel;
import com.igreja.api.models.InfoIgrejaModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.repositories.ArtigosRepository;
import com.igreja.api.utils.PdfUtils;
import com.mchange.v2.beans.BeansUtils;

import lombok.Getter;

@Getter
@Service
public class ArtigoService{
    
   @Autowired
   private ArtigosRepository artigoRepository;

   @Autowired
   private CloudDinaryService upload;


   public ArtigosModel save(ArtigoDto artigo) throws IOException {
      try {
         upload.GerarName(artigo.pdf());
         ArtigosModel artigosM=new ArtigosModel(); 
         upload.uploadFile(artigo.pdf(),"raw");
         artigosM.setPdf(upload.getUrl());
         String coverImagePath = PdfUtils.extractCoverImage(artigo.pdf().getInputStream(), upload.getUniqueName().replace("pdf", "png"));
         upload.uploadFile(new File(coverImagePath), "image");
         artigosM.setImg(upload.getUrl());
         BeanUtils.copyProperties(artigo, artigosM);
         artigosM.setImg(upload.getUrl());
         
         artigosM.setDataPublicacao(LocalDate.now());
         return artigoRepository.save(artigosM); 
      } catch (IOException e) {
            throw new IOException("Pdf não encontrado");
      }
   }

   public List<ArtigosModel> AllData() {
      return artigoRepository.findAll();
   }
   
   public ArtigosModel Select(int id)  {
      return artigoRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Lamentamos mas este artigo não existe na base dados"));
   }

   public List<ComentarioResult> ComentariosAll(int id) {
      List<ComentarioResult> comentarios=new ArrayList<>();
      ArtigosModel artigo=Select(id);
      for (ComentarioModel comentario : artigo.getComentarios()) {
         UserModel user=comentario.getUser();
         comentarios.add(new ComentarioResult(user.getImg(), user.getUsername(), comentario.getDescricao()));
      }
      return comentarios;
   }

   public boolean delete(int id) throws InternalError, IOException {
      ArtigosModel artigo= Select(id);
      if (DeleteFiles(artigo.getPdf(), artigo.getImg())) {
         artigoRepository.delete(artigo);   
         return true;
      }
      throw new InternalError("A processo não foi realizado");
   }

   public ArtigosModel edit(int id,ArtigoDto artigo) throws InternalError, IOException {
      ArtigosModel artigoActual=Select(id);
      BeanUtils.copyProperties(artigo, artigoActual);
      if (!artigo.pdf().isEmpty()) {
         if (DeleteFiles(artigoActual.getPdf(),artigoActual.getImg())) {
            String coverImagePath = PdfUtils.extractCoverImage(artigo.pdf().getInputStream(), upload.getUniqueName().replace("pdf", "png"));
            upload.uploadFile(artigo.pdf(),"raw");
            artigoActual.setPdf(upload.getUrl());
            upload.uploadFile(new File(coverImagePath), "image");
            artigoActual.setImg(upload.getUrl());
         }
      }
      return artigoRepository.save(artigoActual); 
   }

   public boolean DeleteFiles(String pdfUrl, String imgUrl) throws IOException {

      // Excluir os arquivos da nuvem
      boolean pdfDeleted = upload.deleteFile(pdfUrl);
      boolean imgDeleted = upload.deleteFile(imgUrl);
  
      return pdfDeleted && imgDeleted;
  }
}
