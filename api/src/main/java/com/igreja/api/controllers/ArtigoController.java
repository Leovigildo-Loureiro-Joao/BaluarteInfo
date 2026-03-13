package com.igreja.api.controllers;

import java.io.IOException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.igreja.api.dto.artigo.*;
import com.igreja.api.enums.ArtigoType;
import com.igreja.api.services.ArtigoService;

import jakarta.validation.Valid;


@RestController
public class ArtigoController {

    @Autowired
    private ArtigoService artigoService;


    @PostMapping(value = "/admin/artigo",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> Register(@ModelAttribute @Valid ArtigoDtoRegister artigo) throws IOException, InterruptedException, ExecutionException, TimeoutException {
        return ResponseEntity.ok(artigoService.save(artigo));
    }

    @DeleteMapping(value = "/admin/artigo/delete/{id}")
    public ResponseEntity<?> Delete(@PathVariable(name = "id") int id) throws IOException, InterruptedException, ExecutionException {
        return ResponseEntity.ok(artigoService.delete(id));
    }

    @PutMapping(value = "/admin/artigo/edit/{id}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> Editar(@PathVariable(name = "id") int id,@ModelAttribute @Valid ArtigoDtoRegister artigo) throws IOException, InterruptedException, ExecutionException, TimeoutException {
        return ResponseEntity.ok(artigoService.edit(id,artigo));
    }

    @GetMapping(value = "/user/artigo")
    public ResponseEntity<?> AllArtigos(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) ArtigoType tipo,
            @RequestParam(required = false) String q) throws IOException {
        return ResponseEntity.ok(artigoService.page(page, size, tipo, q));
    }

    @GetMapping(value = "/admin/artigo")
    public ResponseEntity<?> AllArtigosAdmin(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) ArtigoType tipo,
            @RequestParam(required = false) String q) throws IOException {
        return ResponseEntity.ok(artigoService.page(page, size, tipo, q));
    }

    @GetMapping(value = "/user/artigo/{id}")
    public ResponseEntity<?> SelectArigo(@PathVariable int id) throws IOException {
        return ResponseEntity.ok(artigoService.Select(id));
    }

    @GetMapping(value = "/user/artigo/{id}/comentarioAll")
    public ResponseEntity<?> AllComentarios(@PathVariable int id) throws IOException {
        return ResponseEntity.ok(artigoService.ComentariosAll(id));
    }
    
}
