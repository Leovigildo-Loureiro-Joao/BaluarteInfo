package com.igreja.api.dto.estaticas;

public record AdminDashboardStatsDto(
        Value membros,
        Value actividades,
        Value inscritos,
        Value comentarios,
        Value visitas,
        Value newlester
) {
}

