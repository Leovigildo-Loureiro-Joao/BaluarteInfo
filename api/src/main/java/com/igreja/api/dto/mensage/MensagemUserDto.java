package com.igreja.api.dto.mensage;

import java.time.LocalDateTime;

import com.igreja.api.enums.MensagemType;
import com.igreja.api.enums.StatusMensage;

public record MensagemUserDto(
        int id,
        String descricao,
        String assunto,
        String email,
        String destino,
        boolean lido,
        MensagemType tipo,
        StatusMensage status,
        LocalDateTime dataPublicacao) {
}
