package com.igreja.api.models;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.igreja.api.enums.ArtigosType;
import com.igreja.api.enums.InfoType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
@Entity
@Getter @Setter 
@Table(name = "artigo")
public class ArtigosModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank
    private String descricao;

    @NotBlank
    private String titulo;
    
    @NotBlank
    private int Npagina;

    @NotNull
    private LocalDate dataPublicacao;

    @NotBlank
    private String Escritor;
    @NotBlank
    private String img;
    @NotBlank
    private String pdf;

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "artigo")
    private List<ComentarioModel> comentarios=new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "artigo")
    private List<VistosModel> vistos=new ArrayList<>();
}
