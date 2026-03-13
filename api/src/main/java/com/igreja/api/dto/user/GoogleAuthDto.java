package com.igreja.api.dto.user;

import jakarta.validation.constraints.NotBlank;

public record GoogleAuthDto(@NotBlank String credential) {
}
