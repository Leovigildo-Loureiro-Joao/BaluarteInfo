package com.example.utils;

import com.example.models.UsuarioModel;

public class TokenSeccao {
    private static String token;
    private static UsuarioModel usuarioLogado;


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
   
    public static void setUsuarioLogado(UsuarioModel usuario) {
        TokenSeccao.usuarioLogado = usuario;
    }

    public static UsuarioModel getUsuarioLogado() {
        return usuarioLogado;
    }
}
