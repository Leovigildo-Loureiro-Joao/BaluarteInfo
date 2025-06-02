package com.igreja.api.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserDtoData(@NotNull long id,
@NotNull String nome,
@NotNull String email,
@NotNull String img,
@NotNull String roles) {
} 