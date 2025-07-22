package com.example.services;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

import com.example.dto.audio.AudioDto;
import com.example.dto.audio.AudioDtoRegister;
import com.example.dto.video.VideoDtoModel;
import com.example.models.artigo.ArtigoDto;
import com.example.utils.FilePartUtil;
import com.example.utils.ListUtil;

public class AudioService {

    public List<AudioDto> allAudio() throws IOException, InterruptedException {
        String resposta=ApiService.get("/user/midia/audio");
        return ListUtil.fromJsonList(resposta, AudioDto.class);
    }

    public AudioDto postAudio(AudioDtoRegister audioDtoRegister) throws IOException, InterruptedException {
        String resposta=ApiService.postForm("/admin/midia/audio", audioDtoRegister.toMap(),List.of(
            new FilePartUtil(Paths.get(audioDtoRegister.imagem()), "imagem", FilePartUtil.Formato("image", audioDtoRegister.imagem())),
            new FilePartUtil(Paths.get(audioDtoRegister.url()), "url", FilePartUtil.Formato("audio", audioDtoRegister.url()))
        ));
        return AudioDto.fromJson(resposta);
    }

    
}
