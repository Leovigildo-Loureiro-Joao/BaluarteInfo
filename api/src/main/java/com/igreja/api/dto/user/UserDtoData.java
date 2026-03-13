package com.igreja.api.dto.user;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.igreja.api.enums.UserStatus;

public record UserDtoData(
        long id,
        String nome,
        String email,
        String img,
        String roles,
        UserStatus status,
        String telefone,
        LocalDate dataNascimento,
        String cidade,
        String estado,
        String igreja,
        LocalDate dataBatismo,
        String ministerio,
        String cargo,
        LocalDateTime dataCadastro,
        LocalDateTime dataAprovacao,
        String aprovadoPor,
        LocalDateTime ultimoAcesso,
        String observacoes,
        String motivoBloqueio) {
}
