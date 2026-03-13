package com.igreja.api.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.CarouselItemModel;

public interface CarouselItemRepository extends JpaRepository<CarouselItemModel, Long> {

    List<CarouselItemModel> findAllByOrderByOrdemAsc();
}
