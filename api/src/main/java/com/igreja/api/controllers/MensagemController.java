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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.dto.PageResponse;
import com.igreja.api.dto.mensage.MensagemData;
import com.igreja.api.dto.mensage.MensagemDto;
import com.igreja.api.dto.mensage.MensagemPublicDto;
import com.igreja.api.enums.MensagemType;
import com.igreja.api.services.MensagemService;
import com.igreja.api.services.AdminAuditLogService;
import com.igreja.api.enums.AdminAuditType;

import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.servlet.http.HttpServletRequest;

@RestController
public class MensagemController {

    @Autowired
    private MensagemService mensagemService;

    @Autowired
    private AdminAuditLogService adminAuditLogService;

    @PostMapping(value = "/user/mensagem/send")
    public ResponseEntity<?> Register(@RequestBody @Valid MensagemData mensagem) throws IOException {
        return ResponseEntity.ok(mensagemService.save(new MensagemDto(mensagem.descricao(), mensagem.assunto(), null)));
    }

    @PostMapping(value = "/public/mensagem/send")
    public ResponseEntity<?> RegisterPublic(@RequestBody @Valid MensagemPublicDto mensagem) throws IOException {
        return ResponseEntity.ok(mensagemService.savePublic(mensagem));
    }

    @PostMapping(value = "/admin/mensagem/{id}/received")
    public ResponseEntity<?> Responder(
            @PathVariable(name = "id") int id,
            @RequestBody @Valid MensagemData mensagem,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) throws IOException {
        var result = mensagemService.responder(id,mensagem);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Mensagem respondida",
                    "Resposta enviada para mensagem ID " + id, resolveIp(request), AdminAuditType.SUCESSO);
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping(value = "/admin/mensagem/ignorar/{id}")
    public ResponseEntity<?> Delete(
            @PathVariable(name = "id") int id,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) throws IOException {
        var result = mensagemService.ignorar(id);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Mensagem ignorada",
                    "Mensagem ID " + id + " ignorada", resolveIp(request), AdminAuditType.ALERTA);
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping(value = "/admin/mensagem/{id}/lido")
    public ResponseEntity<?> marcarLido(
            @PathVariable(name = "id") int id,
            @RequestParam(defaultValue = "true") boolean lido,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) {
        var result = mensagemService.marcarLido(id, lido);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Mensagem atualizada",
                    "Mensagem ID " + id + " lido=" + lido, resolveIp(request), AdminAuditType.INFO);
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping(value = "/admin/mensagem/{id}")
    public ResponseEntity<?> DeleteMensagem(
            @PathVariable(name = "id") int id,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) {
        mensagemService.delete(id);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Mensagem removida",
                    "Mensagem ID " + id + " removida", resolveIp(request), AdminAuditType.ALERTA);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/admin/mensagem/all")
    public ResponseEntity<?> AllMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) MensagemType tipo,
            @RequestParam(required = false) Boolean lido) throws IOException {
        var pageable = PageRequest.of(page, size, Sort.by("id").descending());
        var result = resolveMessages(tipo, lido, pageable);
        return ResponseEntity.ok(new PageResponse<>(result.getContent(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages()));
    }

    @GetMapping(value = "/admin/mensagem/{id}")
    public ResponseEntity<?> Select(@PathVariable int id) throws IOException {
        return ResponseEntity.ok(mensagemService.Select(id));
    }

    private org.springframework.data.domain.Page<com.igreja.api.models.MensagensModel> resolveMessages(
            MensagemType tipo,
            Boolean lido,
            org.springframework.data.domain.Pageable pageable) {
        if (tipo != null && lido != null) {
            return mensagemService.pageByTipoAndLido(tipo, lido, pageable);
        }
        if (tipo != null) {
            return mensagemService.pageByTipo(tipo, pageable);
        }
        if (lido != null) {
            return mensagemService.pageByLido(lido, pageable);
        }
        return mensagemService.page(pageable);
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
