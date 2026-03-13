package com.igreja.api.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "config_actividade_tipo")
public class ActividadeTipoConfigModel {

    @Id
    private String id;

    private String label;

    private String color;

    private String icon;
}
