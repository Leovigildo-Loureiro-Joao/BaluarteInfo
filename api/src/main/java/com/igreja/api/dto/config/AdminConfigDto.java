package com.igreja.api.dto.config;

import java.util.List;

public record AdminConfigDto(
        Dashboard dashboard,
        Mensagens messages,
        Inscricoes inscricoes,
        Activities activities,
        List<CarouselItemDto> homeCarousel) {

    public record Dashboard(List<Object> cards, List<Object> timeRanges, int refreshIntervalMs) {
    }

    public record Mensagens(Retention retention, Actions actions) {
    }

    public record Retention(int unreadDays) {
    }

    public record Actions(boolean reenviarPendentes) {
    }

    public record Inscricoes(Qr qr) {
    }

    public record Qr(boolean enabled, boolean autoDisableAfterActivity, int expiresAfterHours) {
    }

    public record Activities(List<ActividadeTipoDto> types) {
    }

    public record ActividadeTipoDto(String id, String label, String color, String icon) {
    }
}
