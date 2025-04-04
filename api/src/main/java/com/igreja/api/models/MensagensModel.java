package com.igreja.api.models;

import java.time.LocalDate;

import com.igreja.api.enums.MensagemType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "mensagem")
public class MensagensModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank
    private String descricao;

    @NotBlank
    private String assunto;

    @Email
    private String email;

    @Email
    private String destino;

    private boolean lido;

    @Enumerated(EnumType.STRING)
    private MensagemType tipo;
    
    private LocalDate dataPublicacao;
    
}
