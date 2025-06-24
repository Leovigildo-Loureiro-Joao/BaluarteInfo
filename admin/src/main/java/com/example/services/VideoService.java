package com.example.services;

import java.io.IOException;
import java.util.List;

import com.example.models.artigo.ArtigoDto;
import com.example.models.video.VideoDtoModel;
import com.example.utils.ListUtil;

public class VideoService {
     
    public List<VideoDtoModel> allArtigos() throws IOException, InterruptedException{
        String resposta=ApiService.get("/user/midia/video");
        return ListUtil.fromJsonList(resposta, VideoDtoModel.class);
    }
}
