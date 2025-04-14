package com.igreja.api.dto.user;

import jakarta.validation.constraints.NotBlank;

public record UserDto(@NotBlank String nome,@NotBlank String password,@NotBlank String email) {
    
}
