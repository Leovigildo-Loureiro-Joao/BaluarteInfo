package com.igreja.api.services;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.NoSuchElementException;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.user.ArtigoDto;
import com.igreja.api.dto.user.InfoDto;
import com.igreja.api.models.ArtigosModel;
import com.igreja.api.models.InfoIgrejaModel;
import com.igreja.api.repositories.ArtigosRepository;
import com.igreja.api.utils.PdfUtils;
import com.igreja.api.utils.UploadUtils;
import com.mchange.v2.beans.BeansUtils;

import lombok.Getter;

@Getter
@Service
public class ArtigoService{
    
   @Autowired
   private ArtigosRepository artigoRepository;
   
   private UploadUtils upload;

   public ArtigoService() {
         upload=new UploadUtils();
   }

   public ArtigosModel save(ArtigoDto artigo) throws IOException {
      try {
         upload.Upload();
         PdfUtils.extractCoverImage("uploads/"+upload.unique, "uploads/",upload.unique.replace("pdf", "png"));
         ArtigosModel artigosM=new ArtigosModel(); 
         BeanUtils.copyProperties(artigo, artigosM);
         artigosM.setImg(upload.unique.replace("pdf", "png"));
         artigosM.setPdf(upload.unique);
         artigosM.setDataPublicacao(LocalDate.now());
         return artigoRepository.save(artigosM); 
      } catch (IOException e) {
            throw new IOException("Pdf não encontrado");
      }
   }

   public boolean delete(int id) throws InternalError, IOException {
      ArtigosModel artigo= artigoRepository.findById(id)
      .orElseThrow(() -> new NoSuchElementException("Lamentamos mas este artigo não existe na base dados"));
      if (DeleteFiles(artigo.getPdf(), artigo.getImg())) {
         artigoRepository.delete(artigo);   
         return true;
      }
      throw new InternalError("A processo não foi realizado");
   }

   public ArtigosModel edit(int id,ArtigoDto artigo) throws InternalError, IOException {
      ArtigosModel artigoActual= artigoRepository.findById(id)
      .orElseThrow(() -> new NoSuchElementException("Lamentamos mas este artigo não existe na base dados"));
      BeanUtils.copyProperties(artigo, artigoActual);
      if (!artigo.pdf().isEmpty()) {
         upload.fileSelect=artigo.pdf();
         upload.Upload();
         PdfUtils.extractCoverImage("uploads/"+upload.unique, "uploads/",upload.unique.replace("pdf", "png"));
         if (DeleteFiles(artigoActual.getPdf(),artigoActual.getImg())) {
            artigoActual.setPdf(upload.unique);
            artigoActual.setImg(upload.unique.replace("pdf", "png"));
         }
      }
      return artigoRepository.save(artigoActual); 
   }

   public boolean DeleteFiles(String pdf,String img) throws IOException {
      File pdfFile = new File("uploads/"+pdf);
      File imgFile = new File("uploads/"+img);
      return pdfFile.delete()&&imgFile.delete();
   }
}
