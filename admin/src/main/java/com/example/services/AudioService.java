package com.example.services;

import java.io.IOException;
import java.util.List;

import com.example.dto.audio.AudioDto;
import com.example.dto.audio.AudioDtoRegister;
import com.example.dto.video.VideoDtoModel;
import com.example.models.artigo.ArtigoDto;
import com.example.utils.ListUtil;

public class AudioService {

    public List<AudioDto> allAudio() throws IOException, InterruptedException {
        String resposta=ApiService.get("/user/midia/audio");
        return ListUtil.fromJsonList(resposta, AudioDto.class);
    }

    public AudioDto postAudio(AudioDtoRegister audioDtoRegister) throws IOException, InterruptedException {
	System.out.println("Cheguei no AudioService.postAudio");
        String resposta=ApiService.post("/admin/midia/audio", audioDtoRegister.toMap());
        return AudioDto.fromJson(resposta);
    }

}
