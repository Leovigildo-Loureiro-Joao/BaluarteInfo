package com.igreja.api.controllers;

import java.time.DateTimeException;
import java.util.NoSuchElementException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import com.igreja.api.dto.PageResponse;
import com.igreja.api.dto.inscrito.InscritosDto;
import com.igreja.api.dto.inscrito.InscritosPublicDto;
import com.igreja.api.repositories.UserRepository;
import com.igreja.api.services.InscritosService;

import jakarta.validation.Valid;

import org.cloudinary.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


@RestController
public class InscritosController {

    @Autowired
    private InscritosService inscritosService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/user/inscritos/{idActividade}")
    public ResponseEntity<?> Register(@PathVariable(name = "idActividade") @Valid int id) throws Exception {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(inscritosService.save(
                            new InscritosDto(userRepository.findByEmail(authentication.getName()).get().getId(), id)));
        } catch (DateTimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/public/inscritos/{idActividade}")
    public ResponseEntity<?> RegisterPublic(
            @PathVariable(name = "idActividade") @Valid int id,
            @RequestBody @Valid InscritosPublicDto inscritosDto) throws Exception {
        try {
            var result = inscritosService.savePublicWithId(id, inscritosDto);
            return ResponseEntity.ok()
                    .header("X-Inscricao-Id", String.valueOf(result.id()))
                    .contentType(MediaType.IMAGE_PNG)
                    .body(result.qrPng());
        } catch (DateTimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/public/inscritos/{inscricaoId}/pdf")
    public ResponseEntity<?> fichaPdfPublic(
            @PathVariable(name = "inscricaoId") long inscricaoId,
            @RequestParam(name = "email") String email) {
        try {
            byte[] pdf = inscritosService.fichaPdfPublic(inscricaoId, email);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"ficha-inscricao.pdf\"")
                    .body(pdf);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Falha ao gerar PDF.", e);
        }
    }


    @PostMapping("/user/inscritos/auntenticar")
    public ResponseEntity<?> Autenticar(@RequestBody @Valid JSONObject inscritosDto) {
        try {
            return ResponseEntity.ok().body(inscritosService.MarcarPresenca(inscritosDto));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(e.getMessage());
        } catch (DateTimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("Falha ao validar o QR Code.");
        }
    }

    @GetMapping("/admin/inscritos")
    public ResponseEntity<?> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) int actividadeId) {
        var pageable = PageRequest.of(page, size, Sort.by("id").descending());
        var resultado = inscritosService.list(pageable, actividadeId);
        return ResponseEntity.ok(new PageResponse<>(resultado.getContent(), resultado.getNumber(), resultado.getSize(),
                resultado.getTotalElements(), resultado.getTotalPages()));
    }
    
}
