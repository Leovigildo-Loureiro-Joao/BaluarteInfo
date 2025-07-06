package com.igreja.api.services;

import java.awt.print.Pageable;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
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
import org.springframework.stereotype.Service;

import com.igreja.api.dto.comentario.ComentarioResult;
import com.igreja.api.dto.midia.ConnectMidiaDto;
import com.igreja.api.dto.midia.MidiaDto;
import com.igreja.api.dto.midia.MidiaFile;
import com.igreja.api.enums.MidiaType;
import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.ComentarioModel;
import com.igreja.api.models.MidiaModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.models.VistosModel;
import com.igreja.api.projection.midia.AudioProjection;
import com.igreja.api.projection.midia.VideoProjection;
import com.igreja.api.repositories.ActividadeRepository;
import com.igreja.api.repositories.MidiaRepository;
import com.igreja.api.repositories.VistosRepository;

@Service
public class MidiaService {

    @Autowired
    public MidiaRepository midiaRepository;

    @Autowired
    public ActividadeRepository actividadeRepository;

    @Autowired
   private VistosRepository vistosRepository;

   @Autowired
   private CloudDinaryService upload;
    
    public MidiaModel save(MidiaDto midiaDto) { 
        MidiaModel midia= new MidiaModel();
        midia.setDataPublicacao(LocalDate.now());
        BeanUtils.copyProperties(midiaDto, midia);
        String videoId = extractYoutubeId(midiaDto.url());
        midia.setUrl(videoId); //
        return midiaRepository.save(midia);
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
        upload.generateUniqueName(midiaDto.imagem().getOriginalFilename());
        midia.setImagem(upload.uploadFileAsync(midiaDto.imagem(), "image"));
        upload.generateUniqueName(midiaDto.url().getOriginalFilename());
        midia.setUrl(upload.uploadFileAsync(midiaDto.url(), "raw"));
    
        // Extração da duração do áudio
        try {
            AudioFileFormat baseFileFormat = AudioSystem.getAudioFileFormat(midiaDto.url().getInputStream());
            Map<String, Object> props = baseFileFormat.properties();
            Object durationObj = props.get("duration");
            if (durationObj != null) {
                long microsegundos = (long) durationObj;
                double segundos = microsegundos / 1_000_000.0;
                midia.setTempo(formatarDuracao((int) segundos));
            } else {
                midia.setTempo("00:00"); // ou outro valor padrão
            }
        } catch (Exception e) {
            midia.setTempo("00:00"); // ou trate/log o erro conforme necessário
        }
    
        BeanUtils.copyProperties(midiaDto, midia);
        return midiaRepository.save(midia);
    }
    
    private String formatarDuracao(int totalSegundos) {
        int minutos = totalSegundos / 60;
        int segundos = totalSegundos % 60;
        return String.format("%02d:%02d", minutos, segundos);
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

    public MidiaModel edit(MidiaFile dto,int id) throws InterruptedException, ExecutionException, TimeoutException{
        MidiaModel midia=Select(id);
        if (midia.getType().equals(MidiaType.IMAGE) && dto.url() != null) {
            if (upload.deleteFileAsync(midia.getUrl()).join()) {
                System.out.println("Deletado com sucesso");
                midia.setUrl(upload.uploadFileAsync(dto.url(),"image"));
            } else {
                System.out.println("Falha ao deletar o arquivo");
            }
        }else  if (dto.type().equals(MidiaType.IMAGE)) {
            upload.generateUniqueName(dto.url().getOriginalFilename());
            midia.setUrl(upload.uploadFileAsync(dto.url(),"image"));
        }
        BeanUtils.copyProperties(dto, midia);
        midia.setDataPublicacao(LocalDate.now());
        return midiaRepository.save(midia);
    }

    public void delete(int id){
        MidiaModel midia=Select(id);
        if (midia.getType().equals(MidiaType.IMAGE)) {
            if (upload.deleteFileAsync(midia.getUrl()).join()) {
                System.out.println("Deletado com sucesso");
                midiaRepository.delete(midia);
            } else {
                System.out.println("Falha ao deletar o arquivo");
            }
            
        }else
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
            comentarios.add(new ComentarioResult(user.getImg(), user.getUsername(), comentario.getDescricao()));
        }
        return comentarios;
    }


}
