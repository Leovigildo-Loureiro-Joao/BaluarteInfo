package com.igreja.api.dto.admin;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AdminProfileDto(
        long id,
        String nome,
        String email,
        String telefone,
        String cargo,
        String avatar,
        LocalDateTime dataCadastro,
        LocalDateTime ultimoAcesso,
        boolean doisFatores,
        String cidade,
        String estado,
        LocalDate dataNascimento,
        String roles) {
}
