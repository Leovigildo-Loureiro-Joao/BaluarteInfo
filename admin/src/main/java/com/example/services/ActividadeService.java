package com.example.services;

import java.io.IOException;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

import com.example.dto.actividade.ActividadeDtoRegister;
import com.example.dto.actividade.ActividadeDtoSimple;
import com.example.utils.FilePartUtil;
import com.example.utils.ListUtil;
import com.example.utils.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class ActividadeService {

    public static List<LocalDateTime> DataActividade() throws IOException, InterruptedException{
        String resposta=ApiService.get("/admin/actividade/datas");
        
        return ListUtil.fromJsonList(resposta, LocalDateTime.class);
    }

    public static List<ActividadeDtoSimple> allActividades() throws IOException, InterruptedException{
        String resposta=ApiService.get("/user/actividade"); 
        return ListUtil.fromJsonList(resposta, ActividadeDtoSimple.class);
    }

    public static ActividadeDtoSimple postActividade(ActividadeDtoRegister actividadeDtoRegister) throws IOException, InterruptedException {
        String resposta=ApiService.postForm("/admin/actividade", actividadeDtoRegister.toMap(),List.of(
            new FilePartUtil(Paths.get(actividadeDtoRegister.img()), "img", FilePartUtil.Formato("image", actividadeDtoRegister.img()))
        ));
        return ActividadeDtoSimple.fromJson(resposta);
    }

     public static ActividadeDtoSimple putActividade(ActividadeDtoRegister actividadeDtoRegister,int id) throws IOException, InterruptedException {
        String resposta=ApiService.putForm("/admin/actividade/"+id, actividadeDtoRegister.toMap(),List.of(
            new FilePartUtil(Paths.get(actividadeDtoRegister.img()), "img", FilePartUtil.Formato("image", actividadeDtoRegister.img()))
        ));
        return ActividadeDtoSimple.fromJson(resposta);
    }


    public static boolean deleteActividade(int id) throws IOException, InterruptedException {
        String resposta=ApiService.delete("/admin/actividade/"+id);
        return Boolean.valueOf(resposta);
    }

}
