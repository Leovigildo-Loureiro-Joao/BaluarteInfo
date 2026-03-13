package com.igreja.api.dto.user;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserDto(
        @NotBlank String nome,
        @NotBlank String password,
        @NotBlank @Email String email,
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
