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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import com.igreja.api.dto.PageResponse;
import com.igreja.api.dto.comentario.Analise;
import com.igreja.api.dto.comentario.ComentarioAdminData;
import com.igreja.api.dto.comentario.ComentarioDto;
import com.igreja.api.dto.comentario.ComentarioStatusDto;
import com.igreja.api.enums.ComentarioStatus;
import com.igreja.api.enums.ComentarioType;
import com.igreja.api.services.ComentarioService;
import com.igreja.api.services.AdminAuditLogService;
import com.igreja.api.enums.AdminAuditType;

import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;


@RestController
public class ComentarioController {
    @Autowired
    private ComentarioService comentarioService; 

    @Autowired
    private AdminAuditLogService adminAuditLogService;

    @PostMapping("/user/comentario")
    public ResponseEntity<?> REgisterComentario(
            @RequestBody @Valid ComentarioDto comentarioDto,
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest request) {
        var result = comentarioService.save(comentarioDto);
        if (userDetails != null) {
            adminAuditLogService.log(userDetails.getUsername(), "Comentário publicado",
                    "Novo comentário criado", resolveIp(request), AdminAuditType.INFO);
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping("/user/comentario/{id}")
    public ResponseEntity<?> EditComentario(
            @PathVariable("id") int id,
            @RequestBody @Valid ComentarioDto comentarioDto,
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest request) {
        var result = comentarioService.edit(comentarioDto,id);
        if (userDetails != null) {
            adminAuditLogService.log(userDetails.getUsername(), "Comentário editado",
                    "Comentário ID " + id + " atualizado", resolveIp(request), AdminAuditType.INFO);
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/user/comentario/{id}")
    public ResponseEntity<?> DeleteComentario(
            @PathVariable("id") int id,
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest request) {
        comentarioService.delete(id);
        if (userDetails != null) {
            adminAuditLogService.log(userDetails.getUsername(), "Comentário removido",
                    "Comentário ID " + id + " removido", resolveIp(request), AdminAuditType.ALERTA);
        }
        return ResponseEntity.ok("Deletado");
    }

    @GetMapping(value = "/user/comentario/{id}")
    public ResponseEntity<?> SelectComentario(@PathVariable int id) throws IOException {
        return ResponseEntity.ok(comentarioService.Select(id,ComentarioType.Actividade));
    }

    @PostMapping("/user/comentario/{id}/curtir")
    public ResponseEntity<?> likeComentario(
            @PathVariable("id") int id,
            @AuthenticationPrincipal UserDetails userDetails) {
        int total = comentarioService.like(id, userDetails.getUsername());
        return ResponseEntity.ok(java.util.Map.of("likes", total));
    }

    @DeleteMapping("/user/comentario/{id}/curtir")
    public ResponseEntity<?> unlikeComentario(
            @PathVariable("id") int id,
            @AuthenticationPrincipal UserDetails userDetails) {
        int total = comentarioService.unlike(id, userDetails.getUsername());
        return ResponseEntity.ok(java.util.Map.of("likes", total));
    }

    @PutMapping("/admin/comentario/analise")
    public ResponseEntity<?> Analisar(@RequestBody @Valid Analise analise) {    
        return ResponseEntity.ok(comentarioService.analise(analise));
    }

    @GetMapping("/admin/comentario")
    public ResponseEntity<?> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) ComentarioStatus status) {
        var result = comentarioService.pageAdmin(page, size, status);
        return ResponseEntity.ok(
                new PageResponse<ComentarioAdminData>(result.getContent(), result.getNumber(), result.getSize(), result.getTotalElements(),
                        result.getTotalPages()));
    }

    @PutMapping("/admin/comentario/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable("id") int id,
            @RequestBody @Valid ComentarioStatusDto dto,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) {
        var result = comentarioService.updateStatus(id, dto);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Comentário moderado",
                    "Comentário ID " + id + " status " + dto.status(), resolveIp(request), AdminAuditType.ALERTA);
        }
        return ResponseEntity.ok(result);
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
