package com.igreja.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.dto.sobre.SobreDto;
import com.igreja.api.services.SobreService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SobreController {

    private final SobreService sobreService;

    // Público (site)
    @GetMapping("/public/sobre")
    public ResponseEntity<SobreDto> getPublic() {
        return ResponseEntity.ok(sobreService.get());
    }

    // Admin (painel)
    @GetMapping("/admin/sobre")
    public ResponseEntity<SobreDto> getAdmin() {
        return ResponseEntity.ok(sobreService.get());
    }

    // Admin salva todo o payload do Sobre em um único request
    @PutMapping("/admin/sobre")
    public ResponseEntity<SobreDto> save(@RequestBody SobreDto dto) {
        return ResponseEntity.ok(sobreService.save(dto));
    }
}
