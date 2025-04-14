package com.igreja.api.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserLoginDto(@NotBlank String password,@Email String email) {
    
}
