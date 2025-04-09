package com.igreja.api.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.dto.InscritosDto;
import com.igreja.api.services.InscritosService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class InscritosController {

    @Autowired
    private InscritosService inscritosService;

    @PostMapping("/user/inscritos/register")
    public ResponseEntity<?> Register(@RequestBody @Valid InscritosDto inscritosDto) {
        try {
            return ResponseEntity.ok().body(inscritosService.save(inscritosDto));    
        } catch (Exception e) {
            // TODO: handle exception
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        
    }
    
}
