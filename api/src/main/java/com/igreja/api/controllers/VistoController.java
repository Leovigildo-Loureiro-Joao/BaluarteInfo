package com.igreja.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.models.AcessoModel;
import com.igreja.api.models.ArtigosModel;
import com.igreja.api.repositories.AcessoRepository;
import com.igreja.api.repositories.ArtigosRepository;
import com.igreja.api.repositories.MidiaRepository;
import com.igreja.api.repositories.VistosRepository;

@RestController
@RequestMapping("/user/vistos")
public class VistoController {

    @Autowired
    private VistosRepository vistosRepository;

    @Autowired
    private ArtigosRepository artigosRepository;

    @Autowired
    private MidiaRepository midiaRepository;


    @GetMapping
    public ResponseEntity<Long> contarVisualizacaoesArtigo( int idArtigo ) {
        long total = vistosRepository.findByArtigo(artigosRepository.findById(idArtigo).get()).size();
        return ResponseEntity.ok(total);
    }

    @GetMapping
    public ResponseEntity<Long> contarVisualizacaoesMidia( int midia ) {
        long total = vistosRepository.findByMidia(midiaRepository.findById(midia).get()).size();
        return ResponseEntity.ok(total);
    }
}
