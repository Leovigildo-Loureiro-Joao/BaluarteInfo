package com.igreja.api.models;

import java.time.LocalDateTime;

import com.igreja.api.enums.NotificacaoType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter 
@Table(name = "notificacao")
public class NotificacaoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank
    private String descricao;

    @NotBlank
    private String assunto;

    private boolean lido;

    @Enumerated(EnumType.STRING)
    private NotificacaoType type;

    private LocalDateTime dataNotificacao;
}
