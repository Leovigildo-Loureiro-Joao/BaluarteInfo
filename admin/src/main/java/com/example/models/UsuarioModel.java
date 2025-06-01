package com.example.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter @Setter
public class UsuarioModel {
    private String id;
    private String nome;
    private String email;
    private String password;
    private String img;
    private String roles;


 
}
