package com.example.services;

import java.util.HashMap;
import java.util.Map;

import com.example.models.UsuarioModel;
import com.example.utils.TokenSeccao;
import com.google.gson.Gson;

public class LoginService {
    
    public UsuarioModel autenticar(String email, String senha) throws Exception {
        Map<String, String> body = new HashMap<>();
        body.put("email", email);
        body.put("password", senha);

        String respostaJson = ApiService.post("/auth/login", body);

        UsuarioModel usuario = new Gson().fromJson(respostaJson, UsuarioModel.class);

        // Guarda na sessão
        TokenSeccao.setUsuarioLogado(usuario);

        return usuario;
    }
}
