package com.igreja.api.services;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.sound.sampled.AudioFileFormat;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.UnsupportedAudioFileException;


import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.comentario.ComentarioResult;
import com.igreja.api.dto.midia.ConnectMidiaDto;
import com.igreja.api.dto.midia.GaleriaAdminItem;
import com.igreja.api.dto.midia.MidiaActividade;
import com.igreja.api.dto.midia.MidiaActividadeV;
import com.igreja.api.dto.midia.MidiaDto;
import com.igreja.api.dto.midia.MidiaFile;
import com.igreja.api.dto.midia.MidiaSimple;
import com.igreja.api.dto.PageResponse;
import com.igreja.api.enums.AudioType;
import com.igreja.api.enums.MidiaType;
import com.igreja.api.projection.midia.MidiaProjection;
import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.ComentarioModel;
import com.igreja.api.models.MidiaModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.models.VistosModel;
import com.igreja.api.projection.midia.AudioProjection;
import com.igreja.api.projection.midia.VideoProjection;
import com.igreja.api.repositories.ActividadeRepository;
import com.igreja.api.repositories.ComentarioLikeRepository;
import com.igreja.api.repositories.MidiaRepository;
import com.igreja.api.repositories.VistosRepository;
import com.igreja.api.utils.AvatarUtils;

@Service
public class MidiaService {

    @Autowired
    public MidiaRepository midiaRepository;

    @Autowired
    public ActividadeRepository actividadeRepository;

    @Autowired
   private VistosRepository vistosRepository;

    @Autowired
    private ComentarioLikeRepository comentarioLikeRepository;

   @Autowired
   private CloudDinaryService upload;
    
    public MidiaModel save(MidiaDto midiaDto) { 
        MidiaModel midia= new MidiaModel();
        midia.setDataPublicacao(LocalDate.now());
        BeanUtils.copyProperties(midiaDto, midia);
        if (midiaDto.type() != null
                && midiaDto.type().equals(MidiaType.VIDEO)
                && midiaDto.url() != null
                && (midiaDto.url().contains("youtube.com") || midiaDto.url().contains("youtu.be"))) {
            String videoId = extractYoutubeId(midiaDto.url());
            midia.setUrl(videoId);
        } else {
            midia.setUrl(midiaDto.url());
        }
        return midiaRepository.save(midia);
    }

       public Object addMidia(MidiaActividadeV actividadeDto) throws InterruptedException, ExecutionException, TimeoutException, UnsupportedAudioFileException, IOException {
        ActividadeModel actividadeModel= actividadeRepository.findById(actividadeDto.id()).orElseThrow();
        MidiaModel midiaModel=save(new MidiaDto(actividadeDto.titulo(),"--/--/--",actividadeDto.img(),actividadeDto.type(), null));    
        midiaModel.setActividade(actividadeModel);
        midiaRepository.save(midiaModel);
        actividadeRepository.save(actividadeModel);
        return "Connectado com sucesso";
    
    }

    public Object addMidia(MidiaActividade actividadeDto) throws InterruptedException, ExecutionException, TimeoutException, UnsupportedAudioFileException, IOException {
        ActividadeModel actividadeModel= actividadeRepository.findById(actividadeDto.id()).orElseThrow();
        MidiaModel midiaModel=save(new MidiaFile(actividadeDto.titulo(),"--/--/--",null,actividadeDto.img(),actividadeDto.type(),null ,null));    
        midiaModel.setActividade(actividadeModel);
        midiaRepository.save(midiaModel);
        actividadeRepository.save(actividadeModel);
        return "Connectado com sucesso";
    
    }

    public String extractYoutubeId(String url) {
        if (url == null || url.isEmpty()) return null;

        Pattern pattern = Pattern.compile(
            "(?:youtube\\.com\\/(?:watch\\?v=|embed\\/)|youtu\\.be\\/)([\\w-]{11})",
            Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(url);

        if (matcher.find()) {
            return matcher.group(1); // O ID do vídeo
        }

        throw new IllegalArgumentException("URL do YouTube inválida: " + url);
    }


    public MidiaModel save(MidiaFile midiaDto) throws InterruptedException, ExecutionException, TimeoutException, UnsupportedAudioFileException, IOException { 
        MidiaModel midia = new MidiaModel();
        midia.setDataPublicacao(LocalDate.now());
        BeanUtils.copyProperties(midiaDto, midia);

        if (midiaDto.type() == null) {
            throw new IllegalArgumentException("O tipo de mídia é obrigatório.");
        }

        if (hasUpload(midiaDto.imagem())) {
            upload.generateUniqueName(midiaDto.imagem().getOriginalFilename());
            midia.setImagem(upload.uploadFileAsync(midiaDto.imagem(), "image"));
        } else if (midiaDto.type().equals(MidiaType.AUDIO) || midiaDto.type().equals(MidiaType.VIDEO)) {
            throw new IllegalArgumentException("A imagem de capa é obrigatória.");
        }

        if (midiaDto.type().equals(MidiaType.IMAGE)) {
            if (midia.getImagem() == null || midia.getImagem().isBlank()) {
                throw new IllegalArgumentException("A imagem é obrigatória.");
            }
            midia.setUrl(midia.getImagem());
            return midiaRepository.save(midia);
        }

        if (!hasUpload(midiaDto.url())) {
            throw new IllegalArgumentException("O ficheiro é obrigatório.");
        }

        if (midiaDto.type().equals(MidiaType.AUDIO)) {
            upload.generateUniqueName(midiaDto.url().getOriginalFilename());
            CloudinaryUploadResult result = upload.uploadFileWithInfoAsync(midiaDto.url(), "video");
            midia.setUrl(result.url());
            if (result.durationSeconds() != null) {
                midia.setTempo(formatarDuracao(result.durationSeconds().intValue()));
            } else {
                midia.setTempo(extractAudioDurationOrDefault(midiaDto.url()));
            }
        } else if (midiaDto.type().equals(MidiaType.VIDEO)) {
            upload.generateUniqueName(midiaDto.url().getOriginalFilename());
            CloudinaryUploadResult result = upload.uploadFileWithInfoAsync(midiaDto.url(), "video");
            midia.setUrl(result.url());
            if (result.durationSeconds() != null) {
                midia.setTempo(formatarDuracao(result.durationSeconds().intValue()));
            }
        }

        return midiaRepository.save(midia);
    }
    
    private String formatarDuracao(int totalSegundos) {
        int minutos = totalSegundos / 60;
        int segundos = totalSegundos % 60;
        return String.format("%02d:%02d", minutos, segundos);
    }

    private boolean hasUpload(org.springframework.web.multipart.MultipartFile file) {
        return file != null && !file.isEmpty();
    }

    private boolean isCloudinaryUrl(String value) {
        return value != null && value.contains("upload/");
    }

    private String extractAudioDurationOrDefault(org.springframework.web.multipart.MultipartFile audioFile) {
        try {
            AudioFileFormat baseFileFormat = AudioSystem.getAudioFileFormat(audioFile.getInputStream());
            Map<String, Object> props = baseFileFormat.properties();
            Object durationObj = props.get("duration");
            if (durationObj instanceof Long microsegundos) {
                double segundos = microsegundos / 1_000_000.0;
                return formatarDuracao((int) segundos);
            }
        } catch (Exception ignored) {
        }
        return "00:00";
    }
    
    public MidiaModel Select(int id)  {
        MidiaModel midia=midiaRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Lamentamos mas este artigo não existe na base dados"));
        return midia;
   }

    public MidiaModel Visto(int id)  {
        MidiaModel midia=midiaRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Lamentamos mas este artigo não existe na base dados"));
        VistosModel vistos=new VistosModel();
        vistos.setMidia(midia);
        vistosRepository.save(vistos);
        return midia;
    }

    public MidiaModel edit(MidiaDto dto,int id){
        MidiaModel midia=Select(id);
        BeanUtils.copyProperties(dto, midia);
        midia.setDataPublicacao(LocalDate.now());
        return midiaRepository.save(midia);
    }

    public MidiaModel edit(MidiaFile dto,int id) throws InterruptedException, ExecutionException, TimeoutException, UnsupportedAudioFileException, IOException{
        MidiaModel midia=Select(id);

        if (hasUpload(dto.imagem())) {
            if (isCloudinaryUrl(midia.getImagem())) {
                upload.deleteFileAsync(midia.getImagem()).join();
            }
            upload.generateUniqueName(dto.imagem().getOriginalFilename());
            midia.setImagem(upload.uploadFileAsync(dto.imagem(), "image"));

            if (midia.getType().equals(MidiaType.IMAGE)) {
                midia.setUrl(midia.getImagem());
            }
        }

        if (hasUpload(dto.url())) {
            if (midia.getType().equals(MidiaType.IMAGE)) {
                if (isCloudinaryUrl(midia.getUrl())) {
                    upload.deleteFileAsync(midia.getUrl()).join();
                }
                upload.generateUniqueName(dto.url().getOriginalFilename());
                midia.setUrl(upload.uploadFileAsync(dto.url(), "image"));
                midia.setImagem(midia.getUrl());
            } else if (midia.getType().equals(MidiaType.AUDIO)) {
                if (isCloudinaryUrl(midia.getUrl())) {
                    upload.deleteFileAsync(midia.getUrl()).join();
                }
                upload.generateUniqueName(dto.url().getOriginalFilename());
                CloudinaryUploadResult result = upload.uploadFileWithInfoAsync(dto.url(), "video");
                midia.setUrl(result.url());
                if (result.durationSeconds() != null) {
                    midia.setTempo(formatarDuracao(result.durationSeconds().intValue()));
                } else {
                    midia.setTempo(extractAudioDurationOrDefault(dto.url()));
                }
            } else if (midia.getType().equals(MidiaType.VIDEO)) {
                if (isCloudinaryUrl(midia.getUrl())) {
                    upload.deleteFileAsync(midia.getUrl()).join();
                }
                upload.generateUniqueName(dto.url().getOriginalFilename());
                CloudinaryUploadResult result = upload.uploadFileWithInfoAsync(dto.url(), "video");
                midia.setUrl(result.url());
                if (result.durationSeconds() != null) {
                    midia.setTempo(formatarDuracao(result.durationSeconds().intValue()));
                }
            }
        }

        BeanUtils.copyProperties(dto, midia);
        midia.setDataPublicacao(LocalDate.now());
        return midiaRepository.save(midia);
    }

    public void delete(int id){
        MidiaModel midia=Select(id);
        if (midia.getType().equals(MidiaType.IMAGE)) {
            if (isCloudinaryUrl(midia.getUrl())) {
                upload.deleteFileAsync(midia.getUrl()).join();
            }
            midiaRepository.delete(midia);
            return;
        }

        if (midia.getType().equals(MidiaType.AUDIO) || midia.getType().equals(MidiaType.VIDEO)) {
            if (isCloudinaryUrl(midia.getUrl())) {
                upload.deleteFileAsync(midia.getUrl()).join();
            }
            if (isCloudinaryUrl(midia.getImagem())) {
                upload.deleteFileAsync(midia.getImagem()).join();
            }
        }

        midiaRepository.delete(midia);
    }

    public void deleteFile(int id){
        MidiaModel midia=Select(id);
        midiaRepository.delete(midia);
    }

    public List<VideoProjection> AllVideo(int page,int size) {
        return midiaRepository.findAllVideoByTypeOrderByIdDesc(MidiaType.VIDEO, PageRequest.of(page, size)).getContent();
    }

    public List<AudioProjection> AllAudio(int page, int size) {
        return midiaRepository.findAllAudioByTypeOrderByIdDesc(MidiaType.AUDIO, PageRequest.of(page, size)).getContent();
    }

    public PageResponse<MidiaProjection> page(int page, int size, MidiaType type,
            AudioType audioType, com.igreja.api.enums.VideoType videoType, String q) {
        String search = (q == null || q.isBlank()) ? "" : q.trim();
        Pageable pageable = PageRequest.of(page, size);
        var result = midiaRepository.search(type, audioType, videoType, search, pageable);
        return new PageResponse<>(result.getContent(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages());
    }

    public String ConnectActividade(ConnectMidiaDto connect) {
        ActividadeModel actividadeModel= actividadeRepository.findById(connect.actividade()).orElseThrow();
        MidiaModel midiaModel= midiaRepository.findById(connect.midia()).orElseThrow();
        midiaModel.setActividade(actividadeModel);
        actividadeModel.getMidia().add(midiaModel);
        midiaRepository.save(midiaModel);
        actividadeRepository.save(actividadeModel);
        return "Connectado com sucesso";
    }


   

    public List<ComentarioResult> ComentariosAll(int id) {
        List<ComentarioResult> comentarios=new ArrayList<>();
        MidiaModel artigo=Select(id);
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

    public PageResponse<MidiaSimple> Galeria(int id, int page, int size) {
        return GaleriaTrailler(id, MidiaType.IMAGE, page, size);
    }

    
    public PageResponse<MidiaSimple> Trailler(int id, int page, int size) {
        return GaleriaTrailler(id, MidiaType.VIDEO, page, size);
    }


    public PageResponse<MidiaSimple> GaleriaTrailler(int id,MidiaType type, int page, int size) {
        Optional<ActividadeModel> act=actividadeRepository.findById(id);
        Pageable pageable = PageRequest.of(page, size);
        var midia = midiaRepository.findByActividadeAndType(act.get(), type, pageable)
            .map(m -> new MidiaSimple(m.getId(), m.getTitulo(), m.getUrl()));

        return new PageResponse<>(midia.getContent(), midia.getNumber(), midia.getSize(),
                midia.getTotalElements(), midia.getTotalPages());
    }

    public PageResponse<GaleriaAdminItem> galeriaAdmin(int page, int size, String q) {
        Pageable pageable = PageRequest.of(page, size);
        String search = (q == null || q.isBlank()) ? "" : q.trim();
        var result = midiaRepository.findGaleriaAdmin(MidiaType.IMAGE, search, pageable);
        return new PageResponse<>(result.getContent(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages());
    }

}
