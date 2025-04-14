package com.igreja.api.services;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeoutException;

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
import com.igreja.api.models.VistosModel;
import com.igreja.api.repositories.ArtigosRepository;
import com.igreja.api.repositories.VistosRepository;
import com.igreja.api.utils.PdfUtils;
import com.mchange.v2.beans.BeansUtils;

import lombok.Getter;

@Getter
@Service
public class ArtigoService{
    
   @Autowired
   private ArtigosRepository artigoRepository;

   @Autowired
   private VistosRepository vistosRepository;

   @Autowired
   private CloudDinaryService cloudinaryService;


   public ArtigosModel save(ArtigoDto artigo) throws IOException, InterruptedException, ExecutionException, TimeoutException {
      cloudinaryService.generateUniqueName(artigo.pdf().getOriginalFilename());
      ArtigosModel artigosM = new ArtigosModel();
      artigosM.setPdf(cloudinaryService.uploadFileAsync(artigo.pdf(), "raw"));
      artigosM.setImg(cloudinaryService.uploadImageAsync(PdfUtils.extractCoverImageAsync(artigo.pdf().getInputStream()), "image"));
      BeanUtils.copyProperties(artigo, artigosM);
      artigosM.setDataPublicacao(LocalDate.now());
      
      return artigoRepository.save(artigosM);
  }

   public List<ArtigosModel> AllData() {
      return artigoRepository.findAll();
   }
   
   public ArtigosModel Select(int id)  {
      ArtigosModel artigosModel=artigoRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Lamentamos mas este artigo não existe na base dados"));
      return artigosModel;
   }

   public ArtigosModel Visto(int id)  {
      ArtigosModel artigosModel=artigoRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Lamentamos mas este artigo não existe na base dados"));
      VistosModel vistos=new VistosModel();
      vistos.setArtigo(artigosModel);
      vistosRepository.save(vistos);
      return artigosModel;
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

   public boolean delete(int id) throws InternalError, IOException, InterruptedException, ExecutionException {
      ArtigosModel artigo= Select(id);
      if (DeleteFiles(artigo.getPdf(), artigo.getImg())) {
         artigoRepository.delete(artigo);   
         return true;
      }
      throw new InternalError("A processo não foi realizado");
   }

   public ArtigosModel edit(int id,ArtigoDto artigo) throws InternalError, IOException, InterruptedException, ExecutionException, TimeoutException {
      ArtigosModel artigoActual=Select(id);
      BeanUtils.copyProperties(artigo, artigoActual);
      if (!artigo.pdf().isEmpty()) {
         if (DeleteFiles(artigoActual.getPdf(),artigoActual.getImg())) {
            artigoActual.setPdf(cloudinaryService.uploadFileAsync(artigo.pdf(), "raw"));
            BufferedImage coverImagePath = PdfUtils.extractCoverImage(artigo.pdf().getInputStream());
            artigoActual.setImg(cloudinaryService.uploadImageAsync(coverImagePath, "image"));
         }
      }
      return artigoRepository.save(artigoActual); 
   }

   public boolean DeleteFiles(String pdfUrl, String imgUrl) throws IOException, InterruptedException, ExecutionException {

      // Excluir os arquivos da nuvem
      CompletableFuture<Boolean> pdfDeleted = cloudinaryService.deleteFileAsync(pdfUrl);
      CompletableFuture<Boolean> imgDeleted = cloudinaryService.deleteFileAsync(imgUrl);
      CompletableFuture.allOf(pdfDeleted,imgDeleted).join();
      return pdfDeleted.get() && imgDeleted.get();
  }
}
