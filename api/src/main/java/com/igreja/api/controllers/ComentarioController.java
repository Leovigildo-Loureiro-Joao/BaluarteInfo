package com.igreja.api.controllers;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.dto.comentario.Analise;
import com.igreja.api.dto.comentario.ComentarioDto;
import com.igreja.api.enums.ComentarioType;
import com.igreja.api.services.ComentarioService;

import jakarta.validation.Valid;


@RestController
public class ComentarioController {
    @Autowired
    private ComentarioService comentarioService; 

    @PostMapping("/user/comentario")
    public ResponseEntity<?> REgisterComentario(@RequestBody @Valid ComentarioDto comentarioDto) {    
        return ResponseEntity.ok(comentarioService.save(comentarioDto));
    }

    @PutMapping("/user/comentario/{id}")
    public ResponseEntity<?> EditComentario(@PathVariable("id") int id,@RequestBody @Valid ComentarioDto comentarioDto) {    
        return ResponseEntity.ok(comentarioService.edit(comentarioDto,id));
    }

    @DeleteMapping("/user/comentario/{id}")
    public ResponseEntity<?> DeleteComentario(@PathVariable("id") int id) {    
        comentarioService.delete(id);
        return ResponseEntity.ok("Deletado");
    }

    @GetMapping(value = "/user/comentario/{id}")
    public ResponseEntity<?> SelectComentario(@PathVariable int id) throws IOException {
        return ResponseEntity.ok(comentarioService.Select(id,ComentarioType.Actividade));
    }

    @PutMapping("/admin/comentario/analise")
    public ResponseEntity<?> Analisar(@RequestBody @Valid Analise analise) {    
        return ResponseEntity.ok(comentarioService.analise(analise));
    }
    
}
