package com.igreja.api.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.igreja.api.dto.PageResponse;
import com.igreja.api.dto.inscrito.*;
import com.igreja.api.repositories.UserRepository;
import com.igreja.api.services.InscritosService;

import jakarta.validation.Valid;

import org.cloudinary.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


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

    @GetMapping("/admin/inscritos")
    public ResponseEntity<?> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) int actividadeId) {
        var pageable = PageRequest.of(page, size, Sort.by("id").descending());
        var resultado = inscritosService.list(pageable, actividadeId);
        return ResponseEntity.ok(new PageResponse<>(resultado.getContent(), resultado.getNumber(), resultado.getSize(),
                resultado.getTotalElements(), resultado.getTotalPages()));
    }
    
}
