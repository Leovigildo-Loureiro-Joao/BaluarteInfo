   package com.igreja.api.services;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Url;

import com.igreja.api.dto.artigo.*;
import com.igreja.api.dto.InfoDto;
import com.igreja.api.dto.comentario.ComentarioResult;
import com.igreja.api.dto.PageResponse;
import com.igreja.api.enums.ArtigoType;
import com.igreja.api.models.ArtigoModel;
import com.igreja.api.models.ComentarioModel;
import com.igreja.api.models.InfoIgrejaModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.models.VistosModel;
import com.igreja.api.projection.ArtigoDetailProjection;
import com.igreja.api.projection.ArtigoProjection;
import com.igreja.api.repositories.ArtigosRepository;
import com.igreja.api.repositories.ComentarioLikeRepository;
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
   private ComentarioLikeRepository comentarioLikeRepository;

   @Autowired
   private CloudDinaryService cloudinaryService;

   @Value("${app.artigo.preview-pages:3}")
   private int artigoPreviewPages;

   @Value("${app.artigo.cover-placeholder-url:https://placehold.co/1000x600/{bg}/{fg}?text={text}}")
   private String artigoCoverPlaceholderUrl;

   private String buildCoverPlaceholderUrl(String titulo) {
      String safeTitle = (titulo == null || titulo.isBlank()) ? "Artigo" : titulo.trim();
      // Evita textos enormes na capa
      if (safeTitle.length() > 60) {
         safeTitle = safeTitle.substring(0, 57).trim() + "...";
      }

      // Fundo "aleatório" mas estável por artigo (baseado no título)
      String[] palette = new String[] { "5b1b1b", "540000", "781414", "a01a1a", "2f0b0b", "111827", "0f172a" };
      int idx = Math.floorMod(safeTitle.hashCode(), palette.length);
      String bg = palette[idx];
      String fg = "ffffff";
      String text = URLEncoder.encode(safeTitle, StandardCharsets.UTF_8);

      String template = artigoCoverPlaceholderUrl == null ? "" : artigoCoverPlaceholderUrl.trim();
      if (template.contains("{text}") || template.contains("{bg}") || template.contains("{fg}")) {
         return template
               .replace("{bg}", bg)
               .replace("{fg}", fg)
               .replace("{text}", text);
      }

      // Compat: se for uma URL fixa (sem placeholders), usa como fallback.
      return template.isBlank() ? ("https://placehold.co/1000x600/" + bg + "/" + fg + "?text=" + text) : template;
   }

   public ArtigoModel save(ArtigoDtoRegister artigo) throws IOException, InterruptedException, ExecutionException, TimeoutException {
      cloudinaryService.generateUniqueName(artigo.pdf().getOriginalFilename());
  
      ArtigoModel artigosM = new ArtigoModel();
      artigosM.setPdf(cloudinaryService.uploadFileAsync(artigo.pdf(), "raw"));
      if (artigo.img() != null && !artigo.img().isEmpty()) {
         artigosM.setImg(cloudinaryService.uploadImageFileAsync(artigo.img(), "image"));
      } else {
         artigosM.setImg(buildCoverPlaceholderUrl(artigo.titulo()));
      }
      artigosM.setConteudo(PdfUtils.extractHtml(artigo.pdf().getInputStream(), artigoPreviewPages));
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

   public PageResponse<ArtigoProjection> page(int page, int size, ArtigoType tipo, String q) {
      int safePage = Math.max(0, page);
      int safeSize = size <= 0 ? 10 : Math.min(size, 100);
      String search = (q == null || q.isBlank()) ? null : q.trim();
      var pageable = PageRequest.of(safePage, safeSize);
      var result = artigoRepository.search(tipo, search, pageable);
      return new PageResponse<>(result.getContent(), result.getNumber(), result.getSize(),
              result.getTotalElements(), result.getTotalPages());
   }

   public ArtigoModel Select(int id)  {
      ArtigoModel artigoModel=artigoRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Lamentamos mas este artigo não existe na base dados"));
      return artigoModel;
   }

   public ArtigoDetailProjection detail(int id) {
      return artigoRepository.findDetailById(id)
            .orElseThrow(() -> new NoSuchElementException("Lamentamos mas este artigo não existe na base dados"));
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
         int likes = (int) comentarioLikeRepository.countByComentario(comentario);
         comentarios.add(new ComentarioResult(
            comentario.getId(),
            user.getImg(),
            user.getUsername(),
            comentario.getDescricao(),
            comentario.isAnalise(),
            comentario.getDataPublicacao(),
            likes));
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
      boolean hasPdf = artigo.pdf() != null && !artigo.pdf().isEmpty();
      boolean hasImg = artigo.img() != null && !artigo.img().isEmpty();

      if (hasPdf) {
         cloudinaryService.generateUniqueName(artigo.pdf().getOriginalFilename());
      } else if (hasImg) {
         cloudinaryService.generateUniqueName(artigo.img().getOriginalFilename());
      }

      if (hasPdf) {
         // Troca o PDF e recalcula a prévia do HTML
         cloudinaryService.deleteFileIfCloudinaryAsync(artigoActual.getPdf()).join();
         artigoActual.setPdf(cloudinaryService.uploadFileAsync(artigo.pdf(), "raw"));
         artigoActual.setConteudo(PdfUtils.extractHtml(artigo.pdf().getInputStream(), artigoPreviewPages));
      }

      // Troca a capa apenas se o admin enviar uma imagem
      if (hasImg) {
         cloudinaryService.deleteFileIfCloudinaryAsync(artigoActual.getImg()).join();
         artigoActual.setImg(cloudinaryService.uploadImageFileAsync(artigo.img(), "image"));
      } else if (artigoActual.getImg() == null || artigoActual.getImg().isBlank() || artigoActual.getImg().contains("placehold.co")) {
         artigoActual.setImg(buildCoverPlaceholderUrl(artigoActual.getTitulo()));
      }

      return artigoRepository.save(artigoActual); 
   }

   public boolean DeleteFiles(String pdfUrl, String imgUrl) throws IOException, InterruptedException, ExecutionException {

      // Excluir os arquivos da nuvem
      CompletableFuture<Boolean> pdfDeleted = cloudinaryService.deleteFileIfCloudinaryAsync(pdfUrl);
      CompletableFuture<Boolean> imgDeleted = cloudinaryService.deleteFileIfCloudinaryAsync(imgUrl);
      CompletableFuture.allOf(pdfDeleted,imgDeleted).join();
      return pdfDeleted.get() && imgDeleted.get();
  }

   public ArtigoModel regenerateHtml(int id) throws IOException {
      ArtigoModel artigo = Select(id);
      artigo.setConteudo(PdfUtils.extractHtmlFromUrl(artigo.getPdf(), artigoPreviewPages));
      return artigoRepository.save(artigo);
   }

   public int regenerateHtmlAll() {
      List<ArtigoModel> artigos = artigoRepository.findAll();
      int updated = 0;

      for (ArtigoModel artigo : artigos) {
         try {
            artigo.setConteudo(PdfUtils.extractHtmlFromUrl(artigo.getPdf(), artigoPreviewPages));
            updated++;
         } catch (IOException e) {
            // Ignora falhas pontuais para não abortar o processamento inteiro
         }
      }

      artigoRepository.saveAll(artigos);
      return updated;
   }
}
