package com.example.services;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import com.example.models.actividade.ActividadeDtoSimple;
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


}
