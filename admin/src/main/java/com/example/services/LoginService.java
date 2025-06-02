package com.example.services;

import java.util.HashMap;
import java.util.Map;

import com.example.models.UserModel;
import com.example.models.user.UserDtoData;
import com.example.models.user.UsuarioModel;
import com.example.utils.TokenSeccao;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

public class LoginService {
    
    public UserDtoData autenticar(String email, String senha) throws Exception {
        Map<String, String> body = new HashMap<>();
        body.put("email", email);
        body.put("password", senha);

        Gson respostGson=new Gson();
        
        String respostaJson = ApiService.post("/auth/login", body);
        Map<String,Object> resultado=respostGson.fromJson(respostaJson,Map.class);
        System.out.println(resultado);
        if (respostaJson == null || respostaJson.isEmpty()) {
            throw new Exception("Erro ao autenticar: resposta vazia do servidor.");
        }
        // Guarda na sessão
        TokenSeccao.setToken(resultado.get("token").toString());
       
        ObjectMapper mapper = new ObjectMapper();
        UserDtoData usuario = mapper.convertValue(resultado.get("user"), UserDtoData.class);
        TokenSeccao.setUsuarioLogado(usuario);
        return usuario;
    }
}
