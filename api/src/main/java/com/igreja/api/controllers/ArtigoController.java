package com.igreja.api.controllers;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.igreja.api.dto.ArtigoDto;
import com.igreja.api.services.ArtigoService;

import jakarta.validation.Valid;


@RestController
public class ArtigoController {

    @Autowired
    private ArtigoService artigoService;


    @PostMapping(value = "/admin/artigo/register",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> Register(@ModelAttribute @Valid ArtigoDto artigo) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(artigoService.save(artigo));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping(value = "/admin/artigo/delete/{id}")
    public ResponseEntity<?> Delete(@PathVariable(name = "id") int id) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(artigoService.delete(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping(value = "/admin/artigo/edit/{id}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> Editar(@PathVariable(name = "id") int id,@ModelAttribute @Valid ArtigoDto artigo) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(artigoService.edit(id,artigo));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping(value = "/admin/artigo/all")
    public ResponseEntity<?> AllArtigos() throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(artigoService.AllData());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping(value = "/user/artigo/{id}")
    public ResponseEntity<?> SelectArigo(@PathVariable int id) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(artigoService.Select(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping(value = "/user/artigo/{id}/comentarioAll")
    public ResponseEntity<?> AllComentarios(@PathVariable int id) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(artigoService.ComentariosAll(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    
}
