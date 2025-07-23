package com.igreja.api.services;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeoutException;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Url;

import com.igreja.api.dto.artigo.*;
import com.igreja.api.dto.InfoDto;
import com.igreja.api.dto.comentario.ComentarioResult;
import com.igreja.api.models.ArtigoModel;
import com.igreja.api.models.ComentarioModel;
import com.igreja.api.models.InfoIgrejaModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.models.VistosModel;
import com.igreja.api.projection.ArtigoProjection;
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


   public ArtigoModel save(ArtigoDtoRegister artigo) throws IOException, InterruptedException, ExecutionException, TimeoutException {
      cloudinaryService.generateUniqueName(artigo.pdf().getOriginalFilename());
  
      ArtigoModel artigosM = new ArtigoModel();
      artigosM.setPdf(cloudinaryService.uploadFileAsync(artigo.pdf(), "raw"));
      artigosM.setImg(cloudinaryService.uploadImageAsync(PdfUtils.extractCoverImageAsync(artigo.pdf().getInputStream()), "image"));
      BeanUtils.copyProperties(artigo, artigosM);
      artigosM.setDataPublicacao(LocalDateTime.now());
      
      // Adicionado da branch admin
      artigosM.setNPagina(BuscarNPagina(artigo.pdf()));
      return artigoRepository.save(artigosM);
  }
  
  public int BuscarNPagina(MultipartFile file) throws IOException {
      ExecutorService executor = Executors.newSingleThreadExecutor();
      CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
          try (PDDocument document = PDDocument.load(file.getInputStream())) {
              return document.getNumberOfPages();
          } catch (IOException e) {
              throw new RuntimeException("Erro ao carregar o PDF", e);
          }
      }, executor);
  
      try {
          int totalPaginas = future.get();
          return totalPaginas;
      } catch (InterruptedException | ExecutionException e) {
          throw new RuntimeException("Erro ao contar páginas", e);
      } finally {
          executor.shutdown();
      }
  }
  
   public List<ArtigoProjection> AllData(int size, int page) {
      return  artigoRepository.findAllByOrderByIdDesc(PageRequest.of(page, size)).getContent();
   }

   public ArtigoModel Select(int id)  {
      ArtigoModel artigoModel=artigoRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Lamentamos mas este artigo não existe na base dados"));
      return artigoModel;
   }

   public ArtigoModel Visto(int id)  {
      ArtigoModel ArtigoModel=artigoRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Lamentamos mas este artigo não existe na base dados"));
      VistosModel vistos=new VistosModel();
      vistos.setArtigo(ArtigoModel);
      vistosRepository.save(vistos);
      return ArtigoModel;
   }

   public List<ComentarioResult> ComentariosAll(int id) {
      List<ComentarioResult> comentarios=new ArrayList<>();
      ArtigoModel artigo=Select(id);
      for (ComentarioModel comentario : artigo.getComentarios()) {
         UserModel user=comentario.getUser();
         comentarios.add(new ComentarioResult(user.getImg(), user.getUsername(), comentario.getDescricao()));
      }
      return comentarios;
   }

   public boolean delete(int id) throws InternalError, IOException, InterruptedException, ExecutionException {
      ArtigoModel artigo= Select(id);
      if (DeleteFiles(artigo.getPdf(), artigo.getImg())) {
         artigoRepository.delete(artigo);   
         return true;
      }
      throw new InternalError("A processo não foi realizado");
   }

   public ArtigoModel edit(int id,ArtigoDtoRegister artigo) throws InternalError, IOException, InterruptedException, ExecutionException, TimeoutException {
      ArtigoModel artigoActual=Select(id);
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
