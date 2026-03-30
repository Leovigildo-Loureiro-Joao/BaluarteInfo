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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.igreja.api.dto.actividade.ActividadeDto;
import com.igreja.api.dto.actividade.ProgramacaoItemUpsertDto;
import com.igreja.api.dto.actividade.ProgramacaoItemView;
import com.igreja.api.dto.actividade.ProgramacaoStatus;
import com.igreja.api.dto.comentario.ComentarioResult;
import com.igreja.api.dto.PageResponse;
import com.igreja.api.enums.ActividadeType;
import com.igreja.api.enums.PublicoAlvoType;
import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.ArtigoModel;
import com.igreja.api.models.ComentarioModel;
import com.igreja.api.models.InscritosModel;
import com.igreja.api.models.MidiaModel;
import com.igreja.api.models.ProgramacaoActividadeModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.projection.ActividadeProjection;
import com.igreja.api.repositories.ActividadeRepository;
import com.igreja.api.repositories.ActividadeFavoritoRepository;
import com.igreja.api.repositories.ComentarioLikeRepository;
import com.igreja.api.repositories.ComentarioRepository;
import com.igreja.api.repositories.InscritosRepository;
import com.igreja.api.repositories.MidiaRepository;
import com.igreja.api.repositories.ProgramacaoActividadeRepository;
import com.igreja.api.utils.AvatarUtils;

import jakarta.validation.Valid;

@Service
public class ActividadeService {

    private static final Logger log = LoggerFactory.getLogger(ActividadeService.class);
    
    @Autowired
    private ActividadeRepository actividadeRepository;

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private ComentarioLikeRepository comentarioLikeRepository;

     @Autowired
    private InscritosRepository inscritosRepository;

    @Autowired
    public MidiaRepository midiaRepository;

    @Autowired
    private ProgramacaoActividadeRepository programacaoRepository;

    @Autowired
    private CloudDinaryService upload;

    @Autowired
    private ActividadeFavoritoRepository favoritoRepository;

    @Autowired
    private UserService userService;

     public ActividadeModel save(ActividadeDto actividade) throws IOException, InterruptedException, ExecutionException, TimeoutException {
        if (actividade.dataEvento().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("A data do evento não pode ser no passado");
        }
        upload.generateUniqueName(actividade.img().getOriginalFilename());
        ActividadeModel actividadeActual=new ActividadeModel();
        actividadeActual.setImg(upload.uploadFileAsync(actividade.img(),"image"));
        actividadeActual.setDataPublicacao(LocalDateTime.now());
        BeanUtils.copyProperties(actividade,actividadeActual);
        if (actividade.edicao() != null && actividade.edicao() > 0) {
            actividadeActual.setEdicao(actividade.edicao());
        } else {
            String titulo = actividade.titulo() == null ? "" : actividade.titulo().trim();
            Integer max = titulo.isBlank() ? 0 : actividadeRepository.findMaxEdicaoByTitulo(titulo);
            actividadeActual.setEdicao((max == null ? 0 : max) + 1);
        }
        return actividadeRepository.save(actividadeActual);
     }

     public ActividadeModel edit(int id,ActividadeDto actividade) throws InternalError, IOException, InterruptedException, ExecutionException, TimeoutException {
        ActividadeModel actividadeActual=Select(id);
        Integer previousEdicao = actividadeActual.getEdicao();
        actividadeActual.setDataPublicacao(LocalDateTime.now());
        BeanUtils.copyProperties(actividade, actividadeActual);
        if (actividade.edicao() != null && actividade.edicao() > 0) {
            actividadeActual.setEdicao(actividade.edicao());
        } else {
            actividadeActual.setEdicao(previousEdicao);
        }
        if (actividade.img() != null && !actividade.img().isEmpty()) {
            if (deleteCloudIfPresent(actividadeActual.getImg())) {
                actividadeActual.setImg(upload.uploadFileAsync(actividade.img(),"image"));
            }
        }
        return actividadeRepository.save(actividadeActual); 
   }

   public ActividadeModel Select(int id)  {
      return actividadeRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Lamentamos mas este actividade não existe na base dados"));
   }

   public ActividadeProjection detail(int id) {
      return actividadeRepository.findDetailById(id)
            .orElseThrow(() -> new NoSuchElementException("Lamentamos mas este actividade não existe na base dados"));
   }

   @Transactional
   public boolean favorite(int actividadeId, String userEmail) {
      ActividadeModel actividade = Select(actividadeId);
      UserModel user = userService.loadUserByEmail(userEmail);
      if (favoritoRepository.existsByActividadeAndUser(actividade, user)) {
         return true;
      }
      com.igreja.api.models.ActividadeFavoritoModel fav = new com.igreja.api.models.ActividadeFavoritoModel();
      fav.setActividade(actividade);
      fav.setUser(user);
      favoritoRepository.save(fav);
      return true;
   }

   @Transactional
   public boolean unfavorite(int actividadeId, String userEmail) {
      ActividadeModel actividade = Select(actividadeId);
      UserModel user = userService.loadUserByEmail(userEmail);
      favoritoRepository.deleteByActividadeAndUser(actividade, user);
      return false;
   }

   public boolean isFavorito(int actividadeId, String userEmail) {
      ActividadeModel actividade = Select(actividadeId);
      UserModel user = userService.loadUserByEmail(userEmail);
      return favoritoRepository.existsByActividadeAndUser(actividade, user);
   }

   public PageResponse<ActividadeProjection> favoritosByUser(String email, int page, int size) {
      UserModel user = userService.loadUserByEmail(email);
      Pageable pageable = PageRequest.of(page, size);
      Page<ActividadeProjection> result = favoritoRepository.pageFavoritosByUserId(user.getId(), pageable);
      return new PageResponse<>(result.getContent(), result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages());
   }

   public List<ProgramacaoItemView> programacao(int actividadeId) {
      // garante que a actividade existe
      Select(actividadeId);
      List<ProgramacaoActividadeModel> items = programacaoRepository.findByActividadeOrder(actividadeId);
      LocalDateTime now = LocalDateTime.now();
      return items.stream().map(item -> toProgramacaoView(item, now)).toList();
   }

   public ProgramacaoItemView addProgramacao(int actividadeId, ProgramacaoItemUpsertDto dto) {
      ActividadeModel actividade = Select(actividadeId);
      ProgramacaoActividadeModel item = new ProgramacaoActividadeModel();
      item.setActividade(actividade);
      applyProgramacaoUpsert(item, dto);
      ProgramacaoActividadeModel saved = programacaoRepository.save(item);
      return toProgramacaoView(saved, LocalDateTime.now());
   }

   public ProgramacaoItemView updateProgramacao(int actividadeId, int itemId, ProgramacaoItemUpsertDto dto) {
      // garante que existe e pertence à actividade
      ProgramacaoActividadeModel item = programacaoRepository.findById(itemId)
            .orElseThrow(() -> new NoSuchElementException("Item de programação não existe."));
      if (item.getActividade() == null || item.getActividade().getId() != actividadeId) {
         throw new NoSuchElementException("Item de programação não pertence a esta actividade.");
      }
      applyProgramacaoUpsert(item, dto);
      ProgramacaoActividadeModel saved = programacaoRepository.save(item);
      return toProgramacaoView(saved, LocalDateTime.now());
   }

   public void deleteProgramacao(int actividadeId, int itemId) {
      ProgramacaoActividadeModel item = programacaoRepository.findById(itemId)
            .orElseThrow(() -> new NoSuchElementException("Item de programação não existe."));
      if (item.getActividade() == null || item.getActividade().getId() != actividadeId) {
         throw new NoSuchElementException("Item de programação não pertence a esta actividade.");
      }
      programacaoRepository.delete(item);
   }

   private void applyProgramacaoUpsert(ProgramacaoActividadeModel item, ProgramacaoItemUpsertDto dto) {
      String titulo = dto.titulo() == null ? "" : dto.titulo().trim();
      if (titulo.isBlank()) {
         throw new IllegalArgumentException("Título é obrigatório.");
      }
      if (dto.inicio() == null) {
         throw new IllegalArgumentException("Início é obrigatório.");
      }
      if (dto.fim() != null && dto.fim().isBefore(dto.inicio())) {
         throw new IllegalArgumentException("Fim não pode ser antes do início.");
      }
      item.setTitulo(titulo);
      item.setInicio(dto.inicio());
      item.setFim(dto.fim());
      item.setTipo(dto.tipo() == null ? com.igreja.api.enums.ProgramacaoTipo.SESSAO : dto.tipo());
      item.setOrdem(dto.ordem());
   }

   private ProgramacaoItemView toProgramacaoView(ProgramacaoActividadeModel item, LocalDateTime now) {
      ProgramacaoStatus status;
      LocalDateTime inicio = item.getInicio();
      LocalDateTime fim = item.getFim();
      if (inicio == null) {
         status = ProgramacaoStatus.UPCOMING;
      } else if (fim != null) {
         if (now.isBefore(inicio)) {
            status = ProgramacaoStatus.UPCOMING;
         } else if (now.isAfter(fim) || now.isEqual(fim)) {
            status = ProgramacaoStatus.DONE;
         } else {
            status = ProgramacaoStatus.ONGOING;
         }
      } else {
         status = now.isBefore(inicio) ? ProgramacaoStatus.UPCOMING : ProgramacaoStatus.DONE;
      }

      return new ProgramacaoItemView(
            item.getId(),
            item.getTitulo(),
            item.getInicio(),
            item.getFim(),
            item.getTipo(),
            item.getOrdem(),
            status);
   }

   private boolean deleteCloudIfPresent(String url) {
      try {
         return upload.deleteFileIfCloudinaryAsync(url).join();
      } catch (Exception e) {
         return false;
      }
   }

   private boolean deleteMidiaAssets(MidiaModel midia) {
      if (midia == null) {
         return true;
      }

      // IMAGEM: normalmente url == imagem
      if (midia.getType() != null && midia.getType().equals(com.igreja.api.enums.MidiaType.IMAGE)) {
         String url = midia.getUrl();
         String img = midia.getImagem();
         boolean a = deleteCloudIfPresent(url);
         boolean b = img == null || img.equals(url) ? true : deleteCloudIfPresent(img);
         return a && b;
      }

      // AUDIO/VIDEO: apaga o ficheiro principal e a capa (quando for do Cloudinary)
      boolean mainDeleted = deleteCloudIfPresent(midia.getUrl());
      boolean coverDeleted = deleteCloudIfPresent(midia.getImagem());
      return mainDeleted && coverDeleted;
   }

  public List<ComentarioResult> ComentariosAll(int id) {
      List<ComentarioResult> comentarios=new ArrayList<>();
      ActividadeModel artigo=Select(id);
      for (ComentarioModel comentario : comentarioRepository.findByActividade(artigo)) {
        if (comentario.getParent() != null) continue;
      
        UserModel user=comentario.getUser();
        int likes = (int) comentarioLikeRepository.countByComentario(comentario);
        comentarios.add(new ComentarioResult(
                comentario.getId(),
                AvatarUtils.resolveAvatar(user.getImg(), user.getEmail(), user.getNome()),
                user.getNome(),
                comentario.getDescricao(),
                comentario.isAnalise(),
                comentario.getDataPublicacao(),
                likes));    
      
        
      }
      return comentarios;
   }

     public List<ComentarioResult> ComentariosAllAnalisados(int id,boolean analise) {
      List<ComentarioResult> comentarios=new ArrayList<>();
      ActividadeModel artigo=Select(id);
     for (ComentarioModel comentario : comentarioRepository.findByActividade(artigo)) {
        if (comentario.getParent() != null) continue;
        if (comentario.isAnalise()==analise) {
            UserModel user=comentario.getUser();
            int likes = (int) comentarioLikeRepository.countByComentario(comentario);
            comentarios.add(new ComentarioResult(
                    comentario.getId(),
                    AvatarUtils.resolveAvatar(user.getImg(), user.getEmail(), user.getNome()),
                    user.getNome(),
                    comentario.getDescricao(),
                    comentario.isAnalise(),
                    comentario.getDataPublicacao(),
                    likes));    
        }
        
      }
      return comentarios;
   }
  
    public PageResponse<InscritosData> InscritosAll(int id, int page, int size) {
      ActividadeModel actividadeModel=Select(id);
      var pageable = PageRequest.of(page, size);
      var result = inscritosRepository.findByActividade(actividadeModel, pageable)
              .map(inscrito -> {
                UserModel user = inscrito.getUser();
                String nome = user != null ? user.getNome() : inscrito.getNome();
                String email = user != null ? user.getEmail() : inscrito.getEmail();
                String telefone = user != null ? user.getTelefone() : inscrito.getTelefone();
                return new InscritosData(
                        inscrito.getId(),
                        actividadeModel.getId(),
                        actividadeModel.getTitulo(),
                        actividadeModel.getTema(),
                        actividadeModel.getDataEvento(),
                        nome,
                        email,
                        telefone,
                        inscrito.getDataInscricao(),
                        inscrito.getDataCheckin(),
                        inscrito.getStatus());
              });
      return new PageResponse<>(result.getContent(), result.getNumber(), result.getSize(),
              result.getTotalElements(), result.getTotalPages());
   }


    @Transactional
    public boolean delete(int id) throws InternalError, IOException {
        ActividadeModel actividade = Select(id);

        try {
            // 1) Apaga assets de todas as mídias ligadas (galeria + trailers + quaisquer outras)
            List<MidiaModel> midias = midiaRepository.findByActividade(actividade);
            boolean midiasAssetsDeleted = true;
            for (MidiaModel midia : midias) {
                midiasAssetsDeleted = deleteMidiaAssets(midia) && midiasAssetsDeleted;
            }
            if (!midiasAssetsDeleted) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                        "Falha ao apagar ficheiros da galeria/traillers na nuvem (Cloudinary).");
            }

            // 2) Remove mídias da BD (e, por cascade, comentários/vistos ligados)
            if (!midias.isEmpty()) {
                midiaRepository.deleteAll(midias);
            }

            // 3) Apaga a imagem da actividade
            boolean actividadeImgDeleted = deleteCloudIfPresent(actividade.getImg());
            if (!actividadeImgDeleted) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                        "Falha ao apagar a imagem da actividade na nuvem (Cloudinary).");
            }

            // 4) Remove a actividade (inscritos/comentários por cascade)
            actividadeRepository.delete(actividade);
            return true;
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Falha ao deletar actividade (id={})", id, e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Não foi possível deletar a actividade agora.", e);
        }
   }

    public List<ActividadeModel> AllData() {
        return actividadeRepository.findAll();
    }

    public PageResponse<ActividadeProjection> page(int page, int size,
            ActividadeType tipoEvento,
            PublicoAlvoType publicoAlvo,
            com.igreja.api.enums.DuracaoActividade duracao,
            String q) {
        String search = (q == null || q.isBlank()) ? "" : q.trim();
        Pageable pageable = PageRequest.of(page, size);
        var result = actividadeRepository.search(tipoEvento, publicoAlvo, duracao, search, pageable);
        return new PageResponse<>(result.getContent(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages());
    }

    public PageResponse<ActividadeProjection> edicoes(int id, int page, int size) {
        ActividadeModel base = Select(id);
        String titulo = base.getTitulo() == null ? "" : base.getTitulo().trim();
        if (titulo.isBlank()) {
            return new PageResponse<>(List.of(), page, size, 0, 0);
        }
        Pageable pageable = PageRequest.of(page, size);
        var result = actividadeRepository.findEdicoesByTitulo(titulo, id, pageable);
        return new PageResponse<>(result.getContent(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages());
    }

    public List<LocalDateTime> AllDataActividade() {
        return actividadeRepository.DatasMarcadas();
    }

    
   

}
