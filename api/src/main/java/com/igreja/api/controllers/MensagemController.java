package com.igreja.api.controllers;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.dto.ArtigoDto;
import com.igreja.api.dto.MensagemDto;
import com.igreja.api.services.MensagemService;


import jakarta.validation.Valid;

@RestController
public class MensagemController {

    @Autowired
    private MensagemService mensagemService;

    @PostMapping(value = "/user/mensagem/send")
    public ResponseEntity<?> Register(@RequestBody @Valid MensagemDto mensagem) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(mensagemService.save(mensagem));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping(value = "/admin/mensagem/{id}/received")
    public ResponseEntity<?> Responder(@PathVariable(name = "id") int id,@RequestBody @Valid MensagemDto mensagem) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(mensagemService.responder(id,mensagem));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping(value = "/admin/mensagem/ignorar/{id}")
    public ResponseEntity<?> Delete(@PathVariable(name = "id") int id) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(mensagemService.ignorar(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping(value = "/admin/mensagem/all")
    public ResponseEntity<?> AllMessages() throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(mensagemService.AllData());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping(value = "/admin/mensagem/{id}")
    public ResponseEntity<?> Select(@PathVariable int id) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(mensagemService.Select(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
