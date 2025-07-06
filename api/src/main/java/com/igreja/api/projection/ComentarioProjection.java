package com.igreja.api.projection;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public interface ComentarioProjection {
    int getId();
    UserData getUser();
    String getDescricao();

    interface UserData {
        String getImagem();
        String getNome();
        Long getId();
    }
}
