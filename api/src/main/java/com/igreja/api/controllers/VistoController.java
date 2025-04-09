package com.igreja.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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


    @GetMapping("/user/vistos/artigo/{id}")
    public ResponseEntity<Long> contarVisualizacaoesArtigo(@PathVariable(name = "id") int idArtigo ) {
        long total = vistosRepository.findByArtigo(artigosRepository.findById(idArtigo).get()).size();
        return ResponseEntity.ok(total);
    }

    @GetMapping("/user/vistos/midia/{id}")
    public ResponseEntity<Long> contarVisualizacaoesMidia(@PathVariable(name = "id") int midia ) {
        long total = vistosRepository.findByMidia(midiaRepository.findById(midia).get()).size();
        return ResponseEntity.ok(total);
    }
}
