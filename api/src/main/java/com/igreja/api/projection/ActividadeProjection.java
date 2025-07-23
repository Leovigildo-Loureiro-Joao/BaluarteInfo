package com.igreja.api.projection;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import com.igreja.api.enums.ActividadeType;
import com.igreja.api.enums.DuracaoActividade;
import com.igreja.api.enums.PublicoAlvoType;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public interface ActividadeProjection{
    int getId();

    String getDescricao();

    String getTema();
    
    String getTitulo();

    String getEndereco();

    ActividadeType getTipoEvento();

    DuracaoActividade getDuracao();

    PublicoAlvoType getPublicoAlvo();

    String getOrganizador();

    LocalDateTime getDataEvento();

    LocalDateTime getDataPublicacao();

    String getContactos();

    String getImg();
}
