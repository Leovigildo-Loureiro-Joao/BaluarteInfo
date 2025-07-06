package com.igreja.api.controllers;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.dto.artigo.*;
import com.igreja.api.dto.actividade.ActividadeDto;
import com.igreja.api.services.ActividadeService;

import jakarta.validation.Valid;

@RestController
public class ActividadeController {
    
    @Autowired
    private ActividadeService actividadeService;

     @PostMapping(value = "/admin/actividade",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> Register(@ModelAttribute @Valid ActividadeDto actividadeDto) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(actividadeService.save(actividadeDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping(value = "/admin/actividade/delete/{id}")
    public ResponseEntity<?> Delete(@PathVariable(name = "id") int id) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(actividadeService.delete(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping(value = "/admin/actividade/edit/{id}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> Editar(@PathVariable(name = "id") int id,@ModelAttribute @Valid ActividadeDto actividadeDto) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(actividadeService.edit(id,actividadeDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping(value = "/user/actividade")
    public ResponseEntity<?> AllActividades( @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(actividadeService.AllDataSimple(page, size));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping(value = "/user/actividade/{id}")
    public ResponseEntity<?> SelectArigo(@PathVariable int id) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(actividadeService.Select(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping(value = "/admin/actividade/datas")
    public ResponseEntity<?> DatasMarcadas() throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(actividadeService.AllDataActividade());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping(value = "/user/actividade/{id}/comentarioAll")
    public ResponseEntity<?> AllComentarios(@PathVariable int id) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(actividadeService.ComentariosAll(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


}
