package com.igreja.api.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.igreja.api.enums.ActividadeType;
import com.igreja.api.enums.DuracaoActividade;
import com.igreja.api.enums.PublicoAlvoType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
    @Column(columnDefinition = "TEXT") // Informa ao JPA que deve usar o tipo TEXT no banco
    private String descricao;

    @NotBlank
    private String tema;

     @NotBlank
    private String titulo;

    @NotBlank
    private String endereco;

    @Enumerated(EnumType.STRING)
    private ActividadeType tipoEvento;

    @Enumerated(EnumType.STRING)
    private PublicoAlvoType publicoAlvo;

    @Enumerated(EnumType.STRING)
    private DuracaoActividade duracao;

    @NotBlank
    private String organizador;

    private LocalDateTime dataPublicacao;

    private LocalDateTime dataEvento;

    @NotBlank
    private String contactos;

    private String img;

     @OneToMany(cascade = CascadeType.ALL,mappedBy = "actividade")
    private List<ComentarioModel> comentarios=new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "actividade")
    private List<MidiaModel> midia=new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "actividade")
    private List<InscritosModel> inscritos=new ArrayList<>();
}
