package com.example.services;

import java.io.IOException;
import java.util.List;

import com.example.models.artigo.ArtigoDto;
import com.example.models.audio.AudioDto;
import com.example.utils.ListUtil;

public class AudioService {

    public List<AudioDto> allAudio() throws IOException, InterruptedException {
        String resposta=ApiService.get("/user/midia/audio");
        return ListUtil.fromJsonList(resposta, AudioDto.class);
    }

}
