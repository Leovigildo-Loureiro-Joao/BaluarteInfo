package com.igreja.api.models;

import com.igreja.api.enums.StatusIncritos;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "inscritos")
public class InscritosModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "user_id",referencedColumnName = "id",nullable = false)
    private UserModel user;

    @ManyToOne
    @JoinColumn(name = "actividade_id",referencedColumnName = "id",nullable = false)
    private ActividadeModel actividade;

    @Enumerated(EnumType.STRING)
    private StatusIncritos status=StatusIncritos.PENDENTE;

}
