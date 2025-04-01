package com.igreja.api.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter 
@Table(name = "actividade")
public class ActividadeModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank
    private String descricao;

    @NotBlank
    private String tema;

    @NotBlank
    private String tipoEvento;

    @NotBlank
    private String publicoAlvo;

    @NotBlank
    private String Organizador;

    @NotBlank
    private LocalDateTime dataPublicacao;

    @NotBlank
    private String contactos;

    private String img;

     @OneToMany(cascade = CascadeType.ALL)
    private List<ComentarioModel> comentarios;

    @OneToMany(cascade = CascadeType.ALL)
    private List<MidiaModel> midia;
}
