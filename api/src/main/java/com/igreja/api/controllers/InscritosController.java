package com.igreja.api.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.dto.inscrito.*;
import com.igreja.api.repositories.UserRepository;
import com.igreja.api.services.InscritosService;

import jakarta.validation.Valid;

import org.cloudinary.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class InscritosController {

    @Autowired
    private InscritosService inscritosService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/user/inscritos/{idActividade}")
    public ResponseEntity<?> Register(@PathVariable(name = "idActividade") @Valid int id) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(inscritosService.save(new InscritosDto(userRepository.findByEmail(authentication.getName()).get().getId(), id)));
    }


    @PostMapping("/user/inscritos/auntenticar")
    public ResponseEntity<?> Autenticar(@RequestBody @Valid JSONObject inscritosDto) {
        return ResponseEntity.ok().body(inscritosService.MarcarPresenca(inscritosDto));
    }
    
}
