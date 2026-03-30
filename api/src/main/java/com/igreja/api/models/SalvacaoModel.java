package com.igreja.api.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "salvacao")
public class SalvacaoModel {

    @Id
    private Integer id;

    // Guarda o JSON completo da página Salvação.
    @Lob
    @Column(columnDefinition = "TEXT")
    private String conteudo;

    public SalvacaoModel(Integer id) {
        this.id = id;
    }
}

