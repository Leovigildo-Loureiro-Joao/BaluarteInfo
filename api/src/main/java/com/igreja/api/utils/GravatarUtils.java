package com.igreja.api.utils;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class GravatarUtils {
    
    public static String getGravatarUrl(String email) {
        try {
            // Normalizar o email (remover espaços e converter para minúsculas)
            String normalizedEmail = email.trim().toLowerCase();

            // Gerar o hash MD5 do email
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hash = md.digest(normalizedEmail.getBytes());
            BigInteger bigInt = new BigInteger(1, hash);
            String md5Hex = bigInt.toString(16);

            // Garantir que o hash tenha 32 caracteres (completar com zeros à esquerda, se necessário)
            while (md5Hex.length() < 32) {
                md5Hex = "0" + md5Hex;
            }

            // Retornar a URL do Gravatar
            return "https://www.gravatar.com/avatar/" + md5Hex + "?d=identicon"; // "identicon" é o avatar padrão
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao gerar hash MD5 para o email", e);
        }
    }
}
