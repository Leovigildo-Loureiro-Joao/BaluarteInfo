package com.example.services;

import java.util.HashMap;
import java.util.Map;

import com.example.models.user.UserDtoData;
import com.example.models.user.UserModel;
import com.example.models.user.UsuarioModel;
import com.example.utils.TokenSeccao;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

public class LoginService {
    
    public boolean autenticar(String email, String senha) throws Exception {
        Map<String, String> body = new HashMap<>();
        body.put("email", email);
        body.put("password", senha);

        Gson respostGson=new Gson();
        
        String respostaJson = ApiService.post("/auth/login", body);
        Map<String,Object> resultado=respostGson.fromJson(respostaJson,Map.class);
        if (respostaJson == null || respostaJson.isEmpty()) {
           return false;
        }
        // Guarda na sessão
        TokenSeccao.setToken(resultado.get("token").toString());
       
        ObjectMapper mapper = new ObjectMapper();
        UserDtoData usuario = mapper.convertValue(resultado.get("user"), UserDtoData.class);
        TokenSeccao.setUsuarioLogado(usuario);
        
        if (!TokenSeccao.getUsuarioLogado().roles().contains("ADMIN")) {
            return false;
        }
        return true;
    }
}
