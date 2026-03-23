   package com.igreja.api.services;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

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
import com.igreja.api.utils.AvatarUtils;
import com.igreja.api.utils.ArtigoHtmlTheme;
import com.igreja.api.utils.MarkdownLite;
import com.igreja.api.utils.PdfUtils;
import com.mchange.v2.beans.BeansUtils;

import lombok.Getter;

@Getter
@Service
public class ArtigoService{

   private static final Logger log = LoggerFactory.getLogger(ArtigoService.class);
    
   @Autowired
   private ArtigosRepository artigoRepository;

   @Autowired
   private VistosRepository vistosRepository;

   @Autowired
   private ComentarioLikeRepository comentarioLikeRepository;

   @Autowired
   private CloudDinaryService cloudinaryService;

   @Autowired
   private GeminiService geminiService;

   @Value("${app.artigo.preview-pages:8}")
   private int artigoPreviewPages;

   @Value("${app.artigo.cover-placeholder-url:https://placehold.co/1000x600/{bg}/{fg}?text={text}}")
   private String artigoCoverPlaceholderUrl;

   @Value("${app.ai.log-gemini-markdown:true}")
   private boolean logGeminiMarkdown;

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

   private String renderFromMarkdown(String titulo, String descricao, String markdown) {
      String body = MarkdownLite.toSafeHtml(markdown);
      return ArtigoHtmlTheme.render(titulo, descricao, body);
   }

   private String renderFromPdfExtractedHtml(String titulo, String descricao, String extractedHtml) {
      return ArtigoHtmlTheme.render(titulo, descricao, extractedHtml);
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
    
    // Se o admin já gerou uma prévia (markdown) no frontend, usa exatamente esse conteúdo (sanitizado).
    if (artigo.markdown() != null && !artigo.markdown().isBlank()) {
        artigosM.setConteudo(renderFromMarkdown(artigo.titulo(), artigo.descricao(), artigo.markdown()));
    } else {
        // Extrair texto do PDF
        String extractedText = PdfUtils.extractText(artigo.pdf().getInputStream(), artigoPreviewPages);

        // Usar Gemini para gerar HTML elegante
        try {
            String htmlContent = geminiService.generateHtmlFromPdf(
                artigo.titulo(), 
                artigo.descricao(), 
                extractedText
            );
            artigosM.setConteudo(htmlContent);
        } catch (Exception e) {
            log.error("Erro ao gerar HTML com Gemini, usando fallback: {}", e.getMessage());
            // Fallback: extrair HTML básico do PDF
            artigosM.setConteudo(renderFromPdfExtractedHtml(artigo.titulo(), artigo.descricao(),
                  PdfUtils.extractHtml(artigo.pdf().getInputStream(), artigoPreviewPages)));
        }
    }
    
    BeanUtils.copyProperties(artigo, artigosM);
    artigosM.setDataPublicacao(LocalDateTime.now());
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
      String search = (q == null || q.isBlank()) ? "" : q.trim();
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
      Visto(id);
      return artigoRepository.findDetailById(id)
            .orElseThrow(() -> new NoSuchElementException("Lamentamos mas este artigo não existe na base dados"));
   }

   /** Detail sem registrar visualização (uso admin/rotas internas). */
   public ArtigoDetailProjection adminDetail(int id) {
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
            AvatarUtils.resolveAvatar(user.getImg(), user.getEmail(), user.getNome()),
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
      try {
         boolean deleted = DeleteFiles(artigo.getPdf(), artigo.getImg());
         artigoRepository.delete(artigo);
         if (!deleted) {
            System.out.print("Arquino nao existente");
         }
         
         return true;
      } catch (ResponseStatusException e) {
         throw e;
      } catch (Exception e) {
         log.error("Falha ao apagar ficheiros do artigo (id={}, pdfUrl={}, imgUrl={})",
               id,
               artigo.getPdf(),
               artigo.getImg(),
               e);
         throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
               "Falha ao apagar ficheiros na nuvem (Cloudinary).", e);
      }
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
         artigoActual.setConteudo(renderFromPdfExtractedHtml(artigoActual.getTitulo(), artigoActual.getDescricao(),
               PdfUtils.extractHtml(artigo.pdf().getInputStream(), artigoPreviewPages)));
      }

      // Se vier uma prévia (markdown), ela deve virar o conteúdo salvo (sanitizado).
      if (artigo.markdown() != null && !artigo.markdown().isBlank()) {
         artigoActual.setConteudo(renderFromMarkdown(artigoActual.getTitulo(), artigoActual.getDescricao(), artigo.markdown()));
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
      String pdfUrl = artigo.getPdf();
      if (pdfUrl == null || pdfUrl.isBlank()) {
         throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Este artigo não tem PDF associado.");
      }

      String extractedText;
      try {
         extractedText = PdfUtils.extractTextFromUrl(pdfUrl, artigoPreviewPages);
      } catch (IOException e) {
         log.warn("Falha ao baixar/ler PDF para regerar HTML (artigoId={}, pages={}, url={})", id, artigoPreviewPages, pdfUrl, e);
         throw new ResponseStatusException(
               HttpStatus.BAD_GATEWAY,
               "Não consegui baixar/ler o PDF deste artigo agora. Confirma se o link do PDF está acessível.",
               e);
      }

      // Se o texto vier ruim (PDF escaneado), cai para o HTML básico extraído do PDF.
      if (extractedText == null || extractedText.isBlank() || extractedText.length() < 200) {
         artigo.setConteudo(renderFromPdfExtractedHtml(artigo.getTitulo(), artigo.getDescricao(),
               PdfUtils.extractHtmlFromUrl(pdfUrl, artigoPreviewPages)));
         return artigoRepository.save(artigo);
      }

      // Regera o HTML "bonito" com Gemini + ArtigoProcessor (que já tem fallback).
      try {
         artigo.setConteudo(geminiService.generateHtmlFromPdf(artigo.getTitulo(), artigo.getDescricao(), extractedText));
      } catch (Exception e) {
         log.warn("Falha ao regerar HTML com Gemini (artigoId={}): {}. Usando fallback do PDF.", id, e.getMessage());
         artigo.setConteudo(renderFromPdfExtractedHtml(artigo.getTitulo(), artigo.getDescricao(),
               PdfUtils.extractHtmlFromUrl(pdfUrl, artigoPreviewPages)));
      }
      return artigoRepository.save(artigo);
   }

   public record ArtigoEnhancePreview(String markdown, String html) {}

   public ArtigoEnhancePreview enhancePreviewWithGemini(int id, int maxPages) throws IOException {
      return enhancePreviewWithGemini(id, maxPages, null);
   }

   public ArtigoEnhancePreview enhancePreviewWithGemini(int id, int maxPages, String instruction) throws IOException {
      int pages = Math.max(1, Math.min(maxPages, 8));
      ArtigoModel artigo = Select(id);

      // Usa o PDF como fonte (limitado a 5 páginas) e deixa o Gemini reestruturar.
      String extractedHtml;
      try {
         extractedHtml = PdfUtils.extractHtmlFromUrl(artigo.getPdf(), pages);
      } catch (IOException e) {
         log.warn("Falha ao extrair HTML do PDF (artigoId={}, pages={}, url={})", id, pages, artigo.getPdf(), e);
         throw new ResponseStatusException(
               HttpStatus.BAD_GATEWAY,
               "Não consegui baixar/ler o PDF deste artigo agora. Confirma se o link do PDF está acessível.",
               e);
      } 

      String plainText = htmlToPlainTextPreserveBreaks(extractedHtml);
      if (logGeminiMarkdown) { 
         log.info("PDF extracted (id={}, pages={}, htmlLen={}, textLen={}): {}",
               id,
               pages,
               extractedHtml == null ? 0 : extractedHtml.length(),
               plainText.length(),
               preview(plainText, 800));
      }

      if (plainText.isBlank() || plainText.length() < 200) {
         throw new ResponseStatusException(
               HttpStatus.UNPROCESSABLE_ENTITY,
               "Não consegui extrair texto suficiente do PDF. Se o PDF for digitalizado (imagem), vai precisar de OCR.");
      }

      try {
         String markdown = geminiService.rewriteToMarkdown(artigo.getTitulo(), artigo.getDescricao(), plainText, instruction);
         if (logGeminiMarkdown) {
            log.info("Gemini markdown (id={}, len={}): {}", id, markdown == null ? 0 : markdown.length(), preview(markdown, 1200));
         }
         String html = renderFromMarkdown(artigo.getTitulo(), artigo.getDescricao(), markdown);
         return new ArtigoEnhancePreview(markdown, html);
      } catch (Exception e) {
         log.warn("Falha ao reestruturar com Gemini (id={}): {}", id, e.getMessage());
         // Fallback: devolve o texto extraído e o HTML base do PDF.
         return new ArtigoEnhancePreview(plainText, extractedHtml);
      }
   }

   public ArtigoEnhancePreview enhancePreviewWithGemini(
         String titulo,
         String descricao,
         org.springframework.web.multipart.MultipartFile pdf,
         int maxPages,
         String instruction) throws IOException {
      int pages = Math.max(1, Math.min(maxPages, 8));

      String extractedHtml;
      try {
         extractedHtml = PdfUtils.extractHtml(pdf.getInputStream(), pages);
      } catch (IOException e) {
         log.warn("Falha ao extrair HTML do PDF enviado (pages={}, filename={})", pages, pdf == null ? null : pdf.getOriginalFilename(), e);
         throw new ResponseStatusException(
               HttpStatus.BAD_GATEWAY,
               "Não consegui ler o PDF enviado agora. Tenta novamente.",
               e);
      }

      String plainText = htmlToPlainTextPreserveBreaks(extractedHtml);
      if (plainText.isBlank() || plainText.length() < 200) {
         throw new ResponseStatusException(
               HttpStatus.UNPROCESSABLE_ENTITY,
               "Não consegui extrair texto suficiente do PDF. Se o PDF for digitalizado (imagem), vai precisar de OCR.");
      }

      try {
         String markdown = geminiService.rewriteToMarkdown(titulo, descricao, plainText, instruction);
         String html = renderFromMarkdown(titulo, descricao, markdown);
         return new ArtigoEnhancePreview(markdown, html);
      } catch (Exception e) {
         log.warn("Falha ao reestruturar com Gemini (upload): {}", e.getMessage());
         return new ArtigoEnhancePreview(plainText, extractedHtml);
      }
   }

   private static String htmlToPlainTextPreserveBreaks(String html) {
      if (html == null || html.isBlank()) {
         return "";
      }

      // Converte quebras comuns de bloco em novas linhas antes de remover tags.
      String withBreaks = html
            .replaceAll("(?i)<\\s*br\\s*/?\\s*>", "\n")
            .replaceAll("(?i)</\\s*p\\s*>", "\n\n")
            .replaceAll("(?i)</\\s*h[1-6]\\s*>", "\n\n")
            .replaceAll("(?i)</\\s*li\\s*>", "\n")
            .replaceAll("(?i)<\\s*hr[^>]*>", "\n\n");

      String text = withBreaks
            .replaceAll("<[^>]*>", " ")
            .replaceAll("[\\t\\x0B\\f\\r ]+", " ")
            .replaceAll("\\n{3,}", "\n\n")
            .trim();
      return text;
   }

   private static String preview(String text, int maxChars) {
      if (text == null) {
         return "";
      }
      String value = text.trim();
      if (value.length() <= maxChars) {
         return value;
      }
      return value.substring(0, Math.max(0, maxChars)).trim() + "\n... (truncado)";
   }

   private static String sha256Hex(String value) {
      try {
         MessageDigest md = MessageDigest.getInstance("SHA-256");
         byte[] digest = md.digest((value == null ? "" : value).getBytes(StandardCharsets.UTF_8));
         StringBuilder sb = new StringBuilder(digest.length * 2);
         for (byte b : digest) {
            sb.append(String.format("%02x", b));
         }
         return sb.toString();
      } catch (Exception e) {
         return "n/a";
      }
   }

   public int regenerateHtmlAll() {
      List<ArtigoModel> artigos = artigoRepository.findAll();
      int updated = 0;

      for (ArtigoModel artigo : artigos) {
         try {
            artigo.setConteudo(renderFromPdfExtractedHtml(artigo.getTitulo(), artigo.getDescricao(),
                  PdfUtils.extractHtmlFromUrl(artigo.getPdf(), artigoPreviewPages)));
            updated++;
         } catch (IOException e) {
            // Ignora falhas pontuais para não abortar o processamento inteiro
         }
      }

      artigoRepository.saveAll(artigos);
      return updated;
   }
}
