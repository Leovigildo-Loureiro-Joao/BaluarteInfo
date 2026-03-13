package com.igreja.api.dto.user;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;

public record UserProfileDto(
        String nome,
        @Email String email,
        String telefone,
        LocalDate dataNascimento,
        String cidade,
        String estado,
        String igreja,
        LocalDate dataBatismo,
        String ministerio,
        String cargo,
        String observacoes) {
}
