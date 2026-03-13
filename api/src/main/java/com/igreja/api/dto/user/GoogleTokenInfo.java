package com.igreja.api.dto.user;

public record GoogleTokenInfo(
        String email,
        String nome,
        String foto,
        boolean emailVerificado) {
}
