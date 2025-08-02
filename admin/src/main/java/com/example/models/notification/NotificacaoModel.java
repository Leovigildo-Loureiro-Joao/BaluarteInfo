package com.example.models.notification;

import java.time.LocalDateTime;

import com.example.enums.NotificacaoType;


public record NotificacaoModel (int id,String descricao,String assunto,boolean lido, NotificacaoType type, LocalDateTime dataNotificacao){
    
}
