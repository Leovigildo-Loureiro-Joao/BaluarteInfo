package com.igreja.api.dto.midia;

import java.util.List;

public record MidiaRelacionadosDto(
        List<MidiaRelacionadoItem> eventosPassados,
        List<MidiaRelacionadoItem> eventosAtuais
) {}
