package com.igreja.api.models;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.validator.constraints.UniqueElements;

import com.igreja.api.enums.ConfigType;
import com.igreja.api.enums.NotificacaoType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter 
@Table(name = "configuracao")
public class ConfiguracaoModel {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    private ConfigType type;

    private double value;

    private LocalDateTime editado;

    private LocalDateTime lancado;

}
