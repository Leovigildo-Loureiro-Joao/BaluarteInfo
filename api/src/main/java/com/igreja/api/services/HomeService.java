package com.igreja.api.services;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.config.CarouselItemDto;
import com.igreja.api.dto.home.HomeDto;
import com.igreja.api.dto.home.StatisticCardDto;
import com.igreja.api.projection.ActividadeProjection;
import com.igreja.api.projection.ArtigoProjection;
import com.igreja.api.projection.midia.MidiaProjection;
import com.igreja.api.repositories.ActividadeRepository;
import com.igreja.api.repositories.ArtigosRepository;
import com.igreja.api.repositories.MidiaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HomeService {

    private final ActividadeRepository actividadeRepository;
    private final MidiaRepository midiaRepository;
    private final ArtigosRepository artigosRepository;
    private final ConfigService config;

    public HomeDto HomeData() {
        ActividadeProjection[] actividades = actividadeRepository.findAllByOrderByIdDesc(PageRequest.of(0, 3))
                .getContent().toArray(new ActividadeProjection[0]);
        MidiaProjection[] midia = midiaRepository.findAllByOrderByIdDesc(PageRequest.of(0, 3))
                .getContent().toArray(new MidiaProjection[0]);
        ArtigoProjection[] artigoProjections = artigosRepository.findAllByOrderByIdDesc(PageRequest.of(0, 3))
                .getContent().toArray(new ArtigoProjection[0]);

        CarouselItemDto[] carousel = config.isHomeCarouselVisible()
                ? config.homeCarousel().toArray(new CarouselItemDto[0])
                : new CarouselItemDto[0];
        StatisticCardDto[] stats = config.isHomeStatsVisible() ? config.homeStats() : new StatisticCardDto[0];

        return new HomeDto(carousel, artigoProjections, midia, actividades, stats, config.isHomeStatsVisible(),
                config.isHomeCarouselVisible());
    }
}
