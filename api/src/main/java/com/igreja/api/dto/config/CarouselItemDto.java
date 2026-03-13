package com.igreja.api.dto.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CarouselItemDto(
        Long id,
        @NotBlank String url,
        @NotBlank String titulo,
        String legenda,
        @NotNull Integer ordem
) {
}
