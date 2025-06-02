package com.example.models.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Getter @Setter
public class UsuarioModel {
    private long id;
    private String nome;
    private String email;
    private String password;
    private String img;
    private String roles;


 
}
