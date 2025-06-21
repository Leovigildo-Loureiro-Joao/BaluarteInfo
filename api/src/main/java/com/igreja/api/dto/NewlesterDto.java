package com.igreja.api.dto;

import jakarta.validation.constraints.NotNull;

public record NewlesterDto(@NotNull String email,@NotNull String nome) {

} 