package com.igreja.api.controllers;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.dto.PageResponse;
import com.igreja.api.dto.mensage.MensagemData;
import com.igreja.api.dto.mensage.MensagemDto;
import com.igreja.api.enums.MensagemType;
import com.igreja.api.services.MensagemService;

import jakarta.validation.Valid;

@RestController
public class MensagemController {

    @Autowired
    private MensagemService mensagemService;

    @PostMapping(value = "/user/mensagem/send")
    public ResponseEntity<?> Register(@RequestBody @Valid MensagemData mensagem) throws IOException {
        return ResponseEntity.ok(mensagemService.save(new MensagemDto(mensagem.descricao(), mensagem.assunto(), null)));
    }

    @PostMapping(value = "/admin/mensagem/{id}/received")
    public ResponseEntity<?> Responder(@PathVariable(name = "id") int id,@RequestBody @Valid MensagemData mensagem) throws IOException {
        return ResponseEntity.ok(mensagemService.responder(id,mensagem));
    }

    @DeleteMapping(value = "/admin/mensagem/ignorar/{id}")
    public ResponseEntity<?> Delete(@PathVariable(name = "id") int id) throws IOException {
        return ResponseEntity.ok(mensagemService.ignorar(id));
    }

    @GetMapping(value = "/admin/mensagem/all")
    public ResponseEntity<?> AllMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) MensagemType tipo) throws IOException {
        var pageable = PageRequest.of(page, size, Sort.by("id").descending());
        var result = tipo != null ? mensagemService.pageByTipo(tipo, pageable) : mensagemService.page(pageable);
        return ResponseEntity.ok(new PageResponse<>(result.getContent(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages()));
    }

    @GetMapping(value = "/admin/mensagem/{id}")
    public ResponseEntity<?> Select(@PathVariable int id) throws IOException {
        return ResponseEntity.ok(mensagemService.Select(id));
    }
}
