package com.igreja.api.dto.home;


import com.igreja.api.dto.config.CarouselItemDto;
import com.igreja.api.dto.home.StatisticCardDto;
import com.igreja.api.projection.ActividadeProjection;
import com.igreja.api.projection.ArtigoProjection;
import com.igreja.api.projection.midia.MidiaProjection;

import jakarta.validation.constraints.NotNull;

public record HomeDto(
        @NotNull CarouselItemDto[] carousel,
        @NotNull ArtigoProjection[] articles,
        @NotNull MidiaProjection[] media,
        ActividadeProjection[] activities,
        StatisticCardDto[] stats,
        boolean showStats,
        boolean showCarousel) {
}
