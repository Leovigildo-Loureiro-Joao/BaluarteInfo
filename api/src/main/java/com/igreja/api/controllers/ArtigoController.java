package com.igreja.api.controllers;

import java.io.IOException;
import java.util.Map;
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
import com.igreja.api.services.AdminAuditLogService;
import com.igreja.api.enums.AdminAuditType;

import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.servlet.http.HttpServletRequest;


@RestController
public class ArtigoController {

    @Autowired
    private ArtigoService artigoService;

    @Autowired
    private AdminAuditLogService adminAuditLogService;


    @PostMapping(value = "/admin/artigo",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> Register(
            @ModelAttribute @Valid ArtigoDtoRegister artigo,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) throws IOException, InterruptedException, ExecutionException, TimeoutException {
        var result = artigoService.save(artigo);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Artigo publicado",
                    "Novo artigo publicado", resolveIp(request), AdminAuditType.SUCESSO);
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping(value = "/admin/artigo/delete/{id}")
    public ResponseEntity<?> Delete(
            @PathVariable(name = "id") int id,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) throws IOException, InterruptedException, ExecutionException {
        var result = artigoService.delete(id);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Artigo removido",
                    "Artigo ID " + id + " removido", resolveIp(request), AdminAuditType.ALERTA);
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping(value = "/admin/artigo/edit/{id}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> Editar(
            @PathVariable(name = "id") int id,
            @ModelAttribute @Valid ArtigoDtoRegister artigo,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) throws IOException, InterruptedException, ExecutionException, TimeoutException {
        var result = artigoService.edit(id,artigo);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Artigo editado",
                    "Artigo ID " + id + " atualizado", resolveIp(request), AdminAuditType.INFO);
        }
        return ResponseEntity.ok(result);
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
        return ResponseEntity.ok(artigoService.detail(id));
    }

    @GetMapping(value = "/user/artigo/{id}/comentarioAll")
    public ResponseEntity<?> AllComentarios(@PathVariable int id) throws IOException {
        return ResponseEntity.ok(artigoService.ComentariosAll(id));
    }

    @PutMapping("/admin/artigo/{id}/html")
    public ResponseEntity<?> RegenerateHtml(@PathVariable int id) throws Exception {
        return ResponseEntity.ok(artigoService.regenerateHtml(id));
    }

    @PutMapping("/admin/artigo/html")
    public ResponseEntity<?> RegenerateHtmlAll() {
        int updated = artigoService.regenerateHtmlAll();
        return ResponseEntity.ok(Map.of("updated", updated));
    }

    private String resolveIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp;
        }
        return request.getRemoteAddr();
    }
    
}
