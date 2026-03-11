package com.example.services;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

import com.example.dto.audio.AudioDto;
import com.example.dto.audio.AudioDtoRegister;
import com.example.dto.video.VideoDtoModel;
import com.example.dto.artigo.ArtigoDto;
import com.example.utils.FilePartUtil;
import com.example.utils.ListUtil;
import java.util.Optional;
import java.util.stream.Stream;

public class AudioService {

    public static List<AudioDto> allAudio() throws IOException, InterruptedException {
        String resposta=ApiService.get("/user/midia/audio");
        return ListUtil.fromJsonList(resposta, AudioDto.class);
    }

    public static AudioDto postAudio(AudioDtoRegister audioDtoRegister) throws IOException, InterruptedException {
        String resposta=ApiService.postForm("/admin/midia/audio", audioDtoRegister.toMap(),List.of(
            new FilePartUtil(Paths.get(audioDtoRegister.imagem()), "imagem", FilePartUtil.Formato("image", audioDtoRegister.imagem())),
            new FilePartUtil(Paths.get(audioDtoRegister.url()), "url", FilePartUtil.Formato("audio", audioDtoRegister.url()))
        ));
        return AudioDto.fromJson(resposta);
    }
    
    public static AudioDto putAudio(AudioDtoRegister audioDtoRegister,int id) throws IOException, InterruptedException {
        List<FilePartUtil> parts = Stream.of(
            Optional.ofNullable(audioDtoRegister.imagem())
                .map(img -> new FilePartUtil(Paths.get(img), "imagem", FilePartUtil.Formato("image", img))),
            Optional.ofNullable(audioDtoRegister.url())
                .map(url -> new FilePartUtil(Paths.get(url), "url", FilePartUtil.Formato("audio", url)))
        )
        .flatMap(Optional::stream)
        .toList();

        String resposta=ApiService.putForm("/admin/midia/audio/"+id, audioDtoRegister.toMap(),parts);
        return AudioDto.fromJson(resposta);
    }

     public static boolean deleteAudio(int id) throws IOException, InterruptedException {
        String resposta=ApiService.delete("/admin/midia/"+id);
        return Boolean.valueOf(resposta);
    }
    
}
