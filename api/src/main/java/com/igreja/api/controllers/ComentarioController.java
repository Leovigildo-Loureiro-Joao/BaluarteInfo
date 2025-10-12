package com.igreja.api.controllers;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
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

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.Valid;


@RestController
public class ComentarioController {
    @Autowired
    private ComentarioService comentarioService; 

    @PostMapping("/user/comentario")
    public ResponseEntity<?> REgisterComentario(@RequestBody @Valid ComentarioDto comentarioDto) {    
       try {
            return ResponseEntity.ok(comentarioService.save(comentarioDto));
        } catch (Exception e) {
             ////System.out.println("Erro: "+e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/user/comentario/{id}")
    public ResponseEntity<?> EditComentario(@PathVariable("id") int id,@RequestBody @Valid ComentarioDto comentarioDto) {    
       try {
            return ResponseEntity.ok(comentarioService.edit(comentarioDto,id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/user/comentario/{id}")
    public ResponseEntity<?> DeleteComentario(@PathVariable("id") int id) {    
       try {
            comentarioService.delete(id);
            return ResponseEntity.ok("Deletado");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping(value = "/user/comentario/{id}")
    public ResponseEntity<?> SelectComentario(@PathVariable int id) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(comentarioService.Select(id,ComentarioType.Actividade));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/admin/comentario/analise")
    public ResponseEntity<?> Analisar(@RequestBody @Valid Analise analise) {    
       try {
            return ResponseEntity.ok(comentarioService.analise(analise));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
}
