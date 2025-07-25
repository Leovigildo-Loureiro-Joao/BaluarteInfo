package com.example.utils;

import com.example.App;
import com.example.models.user.UserDtoData;
import com.example.models.user.UsuarioModel;

public class TokenSeccao {
    private static String token;
    private static UserDtoData usuarioLogado;


    public static String getToken() {
        return token;
    }

    public static void setToken(String token) {
        TokenSeccao.token = token;
    }

    public static boolean isTokenValido() {
        return token != null && !token.isEmpty();
    }

    public static void limparToken() {
        token = null;
    }
   
    public static void setUsuarioLogado(UserDtoData usuario) {
        TokenSeccao.usuarioLogado = usuario;
    }

    public static UserDtoData getUsuarioLogado() {
        return App.teste?new UserDtoData(1,"","","",""):usuarioLogado;
    }
}
