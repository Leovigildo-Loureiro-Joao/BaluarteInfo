package com.example.services;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.dto.video.VideoDtoModel;
import com.example.dto.video.VideoDtoRegister;
import com.example.dto.artigo.ArtigoDto;
import com.example.utils.ListUtil;

public class VideoService {
     
    public static List<VideoDtoModel> allVideos() throws IOException, InterruptedException{
        String resposta=ApiService.get("/user/midia/video");
        return ListUtil.fromJsonList(resposta, VideoDtoModel.class);
    }

     public static VideoDtoModel postVideo(VideoDtoRegister video) throws IOException, InterruptedException{
        String resposta=ApiService.post("/admin/midia/video", video.toMap());
        return VideoDtoModel.fromJson(resposta);
    }
     
       public static VideoDtoModel putVideo(VideoDtoRegister videoDtoRegister,int id) throws IOException, InterruptedException {
        String resposta=ApiService.put("/admin/midia/video/"+id, videoDtoRegister.toMap());
        return VideoDtoModel.fromJson(resposta);
    }


    public static boolean deleteVideo(int id) throws IOException, InterruptedException {
        String resposta=ApiService.delete("/admin/midia/"+id);
        return Boolean.valueOf(resposta);
    }
}
