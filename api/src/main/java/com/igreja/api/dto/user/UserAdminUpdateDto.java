package com.igreja.api.dto.user;

import java.time.LocalDate;

import com.igreja.api.enums.UserStatus;

public record UserAdminUpdateDto(
        String nome,
        String email,
        String telefone,
        LocalDate dataNascimento,
        String cidade,
        String estado,
        String igreja,
        LocalDate dataBatismo,
        String ministerio,
        String cargo,
        String observacoes,
        String roles,
        UserStatus status) {
}
