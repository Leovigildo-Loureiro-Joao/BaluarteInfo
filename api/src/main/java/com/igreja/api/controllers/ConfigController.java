package com.igreja.api.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import com.igreja.api.dto.config.CarouselItemDto;
import com.igreja.api.dto.config.ConfiguracaoDto;
import com.igreja.api.services.CloudDinaryService;
import com.igreja.api.services.ConfigService;

import jakarta.validation.Valid;

@RestController
public class ConfigController {

    private final ConfigService cpConfigService;
    private final CloudDinaryService cloudinaryService;

    public ConfigController(ConfigService cpConfigService, CloudDinaryService cloudinaryService) {
        this.cpConfigService = cpConfigService;
        this.cloudinaryService = cloudinaryService;
    }

     @PutMapping("/admin/config/edit")
    public ResponseEntity<?> EditComentario(@RequestBody @Valid ConfiguracaoDto value) {    
        return ResponseEntity.ok(cpConfigService.edit(value));
    }

     @GetMapping(value = "/admin/config/all")
    public ResponseEntity<?> viewAll() {
        return ResponseEntity.ok(cpConfigService.AllConfiguration());
    }

    @GetMapping("/admin/config/home-carousel")
    public ResponseEntity<?> homeCarousel() {
        return ResponseEntity.ok(cpConfigService.homeCarousel());
    }

    @PutMapping("/admin/config/home-carousel")
    public ResponseEntity<?> saveHomeCarousel(@RequestBody List<@Valid CarouselItemDto> carouselItems) {
        return ResponseEntity.ok(cpConfigService.updateHomeCarousel(carouselItems));
    }

    @PostMapping(value = "/admin/config/home-carousel/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadCarouselImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("titulo") String titulo,
            @RequestParam(value = "legenda", required = false) String legenda) throws Exception {
        cloudinaryService.generateUniqueName(file.getOriginalFilename());
        String url = cloudinaryService.uploadFileAsync(file, "image");
        var created = cpConfigService.createHomeCarouselItem(url, titulo, legenda);
        return ResponseEntity.ok(created);
    }
}
