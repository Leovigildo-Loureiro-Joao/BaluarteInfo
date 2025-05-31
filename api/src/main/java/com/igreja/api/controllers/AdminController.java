package com.igreja.api.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.services.ConfigService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class AdminController {
    
     @Autowired
    private ConfigService cpConfigService;

    @GetMapping("/admin/statics")
    public ResponseEntity<?> Estatisticas() {

        return ResponseEntity.ok().body(cpConfigService.Estatisticas());
    }
    
}
