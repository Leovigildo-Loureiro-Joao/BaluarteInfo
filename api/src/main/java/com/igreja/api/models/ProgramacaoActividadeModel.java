package com.igreja.api.models;

import java.time.LocalDateTime;

import com.igreja.api.enums.ProgramacaoTipo;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "programacao_actividade")
public class ProgramacaoActividadeModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    private ActividadeModel actividade;

    @NotBlank
    private String titulo;

    @NotNull
    private LocalDateTime inicio;

    /** Opcional: se nulo, o item é tratado como pontual (UPCOMING/DONE). */
    private LocalDateTime fim;

    @Enumerated(EnumType.STRING)
    private ProgramacaoTipo tipo = ProgramacaoTipo.SESSAO;

    /** Ordenação manual (opcional). Se nulo, a ordenação usa datas. */
    private Integer ordem;
}

