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
            new FilePartUtil(Paths.get(audioDtoRegister.imagem()), "imagem", Formato("image", audioDtoRegister.imagem())),
            new FilePartUtil(Paths.get(audioDtoRegister.url()), "audio", Formato("audio", audioDtoRegister.url()))
        ));
        return AudioDto.fromJson(resposta);
    }

    public static String Formato(String type, String url) {
        String ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
        switch (ext) {
            case "jpg":
            case "jpeg": return "image/jpeg";
            case "png": return "image/png";
            case "gif": return "image/gif";
            case "bmp": return "image/bmp";
            case "webp": return "image/webp";
            case "mp3": return "audio/mpeg";
            case "wav": return "audio/wav";
            case "ogg": return "audio/ogg";
            default: return type + "/" + ext; // fallback
        }
    }
}
