package com.igreja.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.models.AcessoModel;
import com.igreja.api.repositories.AcessoRepository;

@RestController
@RequestMapping("/user/acessos")
public class AcessoController {

    @Autowired
    private AcessoRepository acessoRepository;

    @PostMapping
    public ResponseEntity<Void> registrarAcesso() {
        acessoRepository.save(new AcessoModel());
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<Long> contarAcessos() {
        long total = acessoRepository.count();
        return ResponseEntity.ok(total);
    }
}
