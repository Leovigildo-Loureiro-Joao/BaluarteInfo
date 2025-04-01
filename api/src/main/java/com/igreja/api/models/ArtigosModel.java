package com.igreja.api.models;

import com.igreja.api.enums.ArtigosType;
import com.igreja.api.enums.InfoType;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;

public class ArtigosModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank
    private String descricao;

    @NotBlank
    private String titulo;

    @NotBlank
    private String Escritor;
    @NotBlank
    private String img;
    @NotBlank
    private String pdf;
}
