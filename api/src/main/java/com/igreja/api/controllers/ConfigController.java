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

import com.igreja.api.dto.config.AdminConfigDto;
import com.igreja.api.dto.config.CarouselItemDto;
import com.igreja.api.dto.config.ConfiguracaoDto;
import com.igreja.api.services.CloudDinaryService;
import com.igreja.api.services.ConfigService;
import com.igreja.api.services.AdminAuditLogService;
import com.igreja.api.enums.AdminAuditType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.servlet.http.HttpServletRequest;

import jakarta.validation.Valid;

@RestController
public class ConfigController {

    private final ConfigService cpConfigService;
    private final CloudDinaryService cloudinaryService;
    private final AdminAuditLogService adminAuditLogService;

    public ConfigController(ConfigService cpConfigService, CloudDinaryService cloudinaryService,
            AdminAuditLogService adminAuditLogService) {
        this.cpConfigService = cpConfigService;
        this.cloudinaryService = cloudinaryService;
        this.adminAuditLogService = adminAuditLogService;
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

    @GetMapping("/admin/config/app")
    public ResponseEntity<?> appConfig() {
        return ResponseEntity.ok(cpConfigService.adminConfig());
    }

    @PutMapping("/admin/config/app")
    public ResponseEntity<?> updateAppConfig(
            @RequestBody AdminConfigDto dto,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) {
        var result = cpConfigService.updateAdminConfig(dto);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Configurações alteradas",
                    "Configurações administrativas atualizadas", resolveIp(request), AdminAuditType.ALERTA);
        }
        return ResponseEntity.ok(result);
    }

    private String resolveIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp;
        }
        return request.getRemoteAddr();
    }
}
