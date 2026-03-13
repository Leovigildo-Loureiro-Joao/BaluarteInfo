package com.igreja.api.services;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.igreja.api.dto.config.CarouselItemDto;
import com.igreja.api.models.CarouselItemModel;
import com.igreja.api.repositories.CarouselItemRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CarouselItemService {

    private final CarouselItemRepository repository;

    public List<CarouselItemDto> listOrdered() {
        return repository.findAllByOrderByOrdemAsc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<CarouselItemDto> upsertAll(List<CarouselItemDto> dtos) {
        AtomicInteger index = new AtomicInteger(0);
        List<CarouselItemModel> models = dtos.stream()
                .map(dto -> {
                    CarouselItemModel model = dto.id() != null ? repository.findById(dto.id()).orElse(new CarouselItemModel())
                            : new CarouselItemModel();
                    model.setUrl(dto.url());
                    model.setTitulo(dto.titulo());
                    model.setLegenda(dto.legenda());
                    model.setOrdem(index.incrementAndGet());
                    model.setAtivo(true);
                    return model;
                })
                .collect(Collectors.toList());
        return repository.saveAll(models).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CarouselItemDto create(String url, String titulo, String legenda) {
        int ordem = repository.findAllByOrderByOrdemAsc().size() + 1;
        CarouselItemModel model = new CarouselItemModel();
        model.setUrl(url);
        model.setTitulo(titulo);
        model.setLegenda(legenda);
        model.setOrdem(ordem);
        model.setAtivo(true);
        return toDto(repository.save(model));
    }

    private CarouselItemDto toDto(CarouselItemModel model) {
        return new CarouselItemDto(
                model.getId(),
                model.getUrl(),
                model.getTitulo(),
                model.getLegenda(),
                model.getOrdem());
    }
}
