package com.igreja.api.models;

import java.time.LocalDate;

import com.igreja.api.enums.InfoType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "comentario")
public class ComentarioModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(referencedColumnName = "id",nullable = false)
    private UserModel user;

    @ManyToOne
    private MidiaModel midia;

    @ManyToOne
    private ArtigosModel artigo;

    @ManyToOne
    private ActividadeModel actividade;

    @NotBlank
    private String descricao;

    private LocalDate dataPublicacao;
    
}