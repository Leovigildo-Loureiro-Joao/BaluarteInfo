package com.igreja.api.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.igreja.api.models.NotificacaoModel;
import com.igreja.api.repositories.NotificacaoRepository;

@Service
public class NotificacaoService {

    @Autowired
    private NotificacaoRepository notificacaoRepository;

    public List<NotificacaoModel> All(){
        return notificacaoRepository.findByLido(true);
    }

    public void NotifyActividadeGaleria(){
        //Quando a muitos comentarios
        //Quando a actividade ja encerrou para marcar momentos
    }

    public void NotifyActividadeLimiteInscritos(){
         //Quando aos incritos previstos excederam para lancar um trailler ou uma mensagem para todos

    }

    public void NotifyActividadeLembrete(){
        //Quando uma actividade ta proxima a acontecer
    }

    public void NotifyVistos(){
        //Quando muitos viram ou acederam muito um artigo ou um video
    }

}
