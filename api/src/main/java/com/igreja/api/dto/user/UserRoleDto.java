package com.igreja.api.dto.user;

import jakarta.validation.constraints.NotBlank;

public record UserRoleDto(@NotBlank String roles) {
}
