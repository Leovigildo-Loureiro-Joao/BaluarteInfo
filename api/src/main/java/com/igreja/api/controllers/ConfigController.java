package com.igreja.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.dto.config.ConfiguracaoDto;
import com.igreja.api.services.ConfigService;

import jakarta.validation.Valid;

@RestController
public class ConfigController {

    @Autowired
    private ConfigService cpConfigService;

     @PutMapping("/admin/config/edit")
    public ResponseEntity<?> EditComentario(@RequestBody @Valid ConfiguracaoDto value) {    
       try {
            return ResponseEntity.ok(cpConfigService.edit(value));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

     @GetMapping(value = "/admin/config/all")
    public ResponseEntity<?> viewAll() {
        try {
            return ResponseEntity.ok(cpConfigService.AllConfiguration());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
     
    }
}
