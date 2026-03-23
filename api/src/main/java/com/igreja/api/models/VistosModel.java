package com.igreja.api.models;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "vistos")
public class VistosModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    private ArtigoModel artigo;

    @ManyToOne
    private MidiaModel midia;

    private LocalDateTime data=LocalDateTime.now();

    /** IP resolvido do request (quando disponível), para deduplicação básica. */
    private String ip;

    @Column(length = 300)
    private String userAgent;

    private Integer watchedSeconds;

    @Column(length = 120)
    private String viewerUsername;

}
