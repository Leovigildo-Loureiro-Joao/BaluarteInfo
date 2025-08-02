package com.example.services;

import java.io.IOException;
import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.example.models.notification.NotificacaoModel;
import com.example.utils.ListUtil;
import com.example.utils.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

public class NotificacaoService {

     public NotificacaoModel Ler(int id) throws IOException, InterruptedException {
        Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
            .create();
        String respostaJson=ApiService.put("/admin/notificacao/"+id+"/ler");
        NotificacaoModel notificacaoModel=gson.fromJson(respostaJson, NotificacaoModel.class);
        return notificacaoModel;
     }
   

}
