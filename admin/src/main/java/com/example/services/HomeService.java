package com.example.services;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

import com.example.dto.Perct_Card;
import com.example.enums.ConfigType;
import com.example.models.config.Statics_dto;
import com.example.models.notification.NotificacaoModel;
import com.example.models.user.UserDtoData;
import com.example.utils.ListUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter 
@NoArgsConstructor
public class HomeService {

    private Statics_dto newlester;
    private Statics_dto comentarios;
    private Statics_dto actividades;
    private Statics_dto actividadesIns;
    private Statics_dto membros;
    private Statics_dto visitas;
    private final ObjectMapper mapper = new ObjectMapper();
    private Gson respostGson=new Gson();

    public Perct_Card TotalValues() throws IOException, InterruptedException{
        String respostaJson=ApiService.get("/admin/statics");
        Type type = new TypeToken<Map<ConfigType, Statics_dto>>() {}.getType();
        Map<ConfigType, Statics_dto> resultado = respostGson.fromJson(respostaJson, type);
        newlester=resultado.get(ConfigType.NewlesterLimite);
        comentarios=resultado.get(ConfigType.ComentarioLimiteActividade);
        actividadesIns=resultado.get(ConfigType.IncritosLimiteActividade);
        actividades=resultado.get(ConfigType.ActividadeLimite);
        membros=resultado.get(ConfigType.MembrosLimite);
        visitas=resultado.get(ConfigType.VisitasLimite);

        return new Perct_Card(Percent(newlester), Percent(comentarios), Percent(actividadesIns), Percent(membros) , Percent(visitas));
    }

    public float Percent(Statics_dto value){
        return (value.value()/value.tot())*100;
    }

    public List<NotificacaoModel> TodasNotificacoesLidas() throws IOException, InterruptedException, JsonSyntaxException{
        String respostaJson=ApiService.get("/admin/notificacao");
        List<NotificacaoModel> notificacaoModels = ListUtil.fromJsonList(respostaJson, NotificacaoModel.class);
        return notificacaoModels;
    }

    public List<NotificacaoModel> TodasNotificacoes() throws IOException, InterruptedException, JsonSyntaxException{
        String respostaJson=ApiService.get("/admin/notificacaoAll");
        List<NotificacaoModel> notificacaoModels = ListUtil.fromJsonList(respostaJson, NotificacaoModel.class);
        return notificacaoModels;
    }


    public String LimparLidas() throws IOException, InterruptedException, JsonSyntaxException{
        String respostaJson=ApiService.delete("/admin/notificacao");
        return respostaJson;
    }


    
}
