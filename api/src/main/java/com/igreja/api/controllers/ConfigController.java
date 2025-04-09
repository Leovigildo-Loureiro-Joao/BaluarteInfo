package com.igreja.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.dto.comentario.ComentarioDto;
import com.igreja.api.dto.config.ValueConfigDto;
import com.igreja.api.services.ConfigService;

import jakarta.validation.Valid;

@RestController
public class ConfigController {

    @Autowired
    private ConfigService cpConfigService;

     @PutMapping("/admin/config/edit")
    public ResponseEntity<?> EditComentario(@RequestBody @Valid ValueConfigDto value) {    
       try {
            return ResponseEntity.ok(cpConfigService.edit(value));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

     @PostMapping(value = "/admin/info/all")
    public ResponseEntity<?> viewAll() {
        try {
            return ResponseEntity.ok(cpConfigService.AllConfiguration());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
     
    }
}
