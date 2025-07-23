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

    public List<LocalDateTime> DataActividade() throws IOException, InterruptedException{
        String resposta=ApiService.get("/admin/actividade/datas");
        
        return ListUtil.fromJsonList(resposta, LocalDateTime.class);
    }

    public List<ActividadeDtoSimple> allActividades() throws IOException, InterruptedException{
        String resposta=ApiService.get("/user/actividade"); 
        return ListUtil.fromJsonList(resposta, ActividadeDtoSimple.class);
    }

    public ActividadeDtoSimple postActividade(ActividadeDtoRegister actividadeDtoRegister) throws IOException, InterruptedException {
        String resposta=ApiService.postForm("/admin/actividade", actividadeDtoRegister.toMap(),List.of(
            new FilePartUtil(Paths.get(actividadeDtoRegister.img()), "img", FilePartUtil.Formato("image", actividadeDtoRegister.img()))
        ));
        return ActividadeDtoSimple.fromJson(resposta);
    }


}
