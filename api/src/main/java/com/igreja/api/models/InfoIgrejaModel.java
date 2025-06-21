package com.igreja.api.models;

import com.igreja.api.enums.InfoType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Getter @Setter 
@Table(name = "info")
public class InfoIgrejaModel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    private InfoType type;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String img;
}
