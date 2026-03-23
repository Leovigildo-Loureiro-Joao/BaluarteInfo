package com.igreja.api.controllers;

import java.io.IOException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.dto.actividade.ActividadeDto;
import com.igreja.api.dto.actividade.ProgramacaoItemUpsertDto;
import com.igreja.api.enums.ActividadeType;
import com.igreja.api.enums.DuracaoActividade;
import com.igreja.api.enums.PublicoAlvoType;
import com.igreja.api.services.ActividadeService;
import com.igreja.api.services.AdminAuditLogService;
import com.igreja.api.enums.AdminAuditType;

import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.servlet.http.HttpServletRequest;

@RestController
public class ActividadeController {
    
    @Autowired
    private ActividadeService actividadeService;

    @Autowired
    private AdminAuditLogService adminAuditLogService;

    @PostMapping(value = "/admin/actividade",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> Register(
            @ModelAttribute @Valid ActividadeDto actividadeDto,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) throws IOException, InterruptedException, ExecutionException, TimeoutException {
        var result = actividadeService.save(actividadeDto);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Atividade criada",
                    "Nova atividade criada", resolveIp(request), AdminAuditType.SUCESSO);
        }
        return ResponseEntity.ok(actividadeService.detail(result.getId()));
    }

   

    @DeleteMapping(value = "/admin/actividade/{id}")
    public ResponseEntity<?> Delete(
            @PathVariable(name = "id") int id,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) throws IOException {
        var result = actividadeService.delete(id);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Atividade removida",
                    "Atividade ID " + id + " removida", resolveIp(request), AdminAuditType.ALERTA);
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping(value = "/admin/actividade/{id}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> Editar(
            @PathVariable(name = "id") int id,
            @ModelAttribute @Valid ActividadeDto actividadeDto,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) throws IOException, InterruptedException, ExecutionException, TimeoutException {
        var result = actividadeService.edit(id,actividadeDto);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Atividade editada",
                    "Atividade ID " + id + " atualizada", resolveIp(request), AdminAuditType.INFO);
        }
        return ResponseEntity.ok(actividadeService.detail(result.getId()));
    }

    @GetMapping(value = "/user/actividade")
    public ResponseEntity<?> AllActividades(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) ActividadeType tipoEvento,
            @RequestParam(required = false) PublicoAlvoType publicoAlvo,
            @RequestParam(required = false) DuracaoActividade duracao,
            @RequestParam(required = false) String q) throws IOException {
        return ResponseEntity.ok(actividadeService.page(page, size, tipoEvento, publicoAlvo, duracao, q));
    }

    @GetMapping(value = "/admin/actividade")
    public ResponseEntity<?> AllActividadesAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) ActividadeType tipoEvento,
            @RequestParam(required = false) PublicoAlvoType publicoAlvo,
            @RequestParam(required = false) DuracaoActividade duracao,
            @RequestParam(required = false) String q) throws IOException {
        return ResponseEntity.ok(actividadeService.page(page, size, tipoEvento, publicoAlvo, duracao, q));
    }

    @GetMapping(value = "/user/actividade/{id}")
    public ResponseEntity<?> SelectArigo(@PathVariable int id) throws IOException {
        return ResponseEntity.ok(actividadeService.detail(id));
    }

    @GetMapping(value = "/user/actividade/{id}/programacao")
    public ResponseEntity<?> programacaoUser(@PathVariable int id) {
        return ResponseEntity.ok(actividadeService.programacao(id));
    }

    @GetMapping(value = "/user/actividade/{id}/edicoes")
    public ResponseEntity<?> edicoes(
            @PathVariable int id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(actividadeService.edicoes(id, page, size));
    }

    @GetMapping(value = "/admin/actividade/{id}/edicoes")
    public ResponseEntity<?> edicoesAdmin(
            @PathVariable int id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(actividadeService.edicoes(id, page, size));
    }

    @GetMapping(value = "/admin/actividade/datas")
    public ResponseEntity<?> DatasMarcadas() throws IOException {
        return ResponseEntity.ok(actividadeService.AllDataActividade());
    }

    // ===== Programação (Admin) =====

    @GetMapping(value = "/admin/actividade/{id}/programacao")
    public ResponseEntity<?> programacao(@PathVariable int id) {
        return ResponseEntity.ok(actividadeService.programacao(id));
    }

    @PostMapping(value = "/admin/actividade/{id}/programacao")
    public ResponseEntity<?> addProgramacao(
            @PathVariable int id,
            @RequestBody @Valid ProgramacaoItemUpsertDto dto,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) {
        var result = actividadeService.addProgramacao(id, dto);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Programação adicionada",
                    "Atividade ID " + id + " programação: " + result.titulo(), resolveIp(request), AdminAuditType.INFO);
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping(value = "/admin/actividade/{id}/programacao/{itemId}")
    public ResponseEntity<?> updateProgramacao(
            @PathVariable int id,
            @PathVariable int itemId,
            @RequestBody @Valid ProgramacaoItemUpsertDto dto,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) {
        var result = actividadeService.updateProgramacao(id, itemId, dto);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Programação atualizada",
                    "Atividade ID " + id + " item " + itemId, resolveIp(request), AdminAuditType.INFO);
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping(value = "/admin/actividade/{id}/programacao/{itemId}")
    public ResponseEntity<?> deleteProgramacao(
            @PathVariable int id,
            @PathVariable int itemId,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) {
        actividadeService.deleteProgramacao(id, itemId);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Programação removida",
                    "Atividade ID " + id + " item " + itemId, resolveIp(request), AdminAuditType.ALERTA);
        }
        return ResponseEntity.ok(java.util.Map.of("deleted", true));
    }

    @GetMapping(value = "/admin/actividade/{id}/comentarios/{analise}")
    public ResponseEntity<?> AllComentariosAnalisados(@PathVariable int id,@PathVariable boolean analise) throws IOException {
        return ResponseEntity.ok(actividadeService.ComentariosAllAnalisados(id,analise));
    }

        @GetMapping(value = "/user/actividade/{id}/comentarios")
    public ResponseEntity<?> AllComentarios(@PathVariable int id) throws IOException {
        return ResponseEntity.ok(actividadeService.ComentariosAll(id));
    }
    
        @GetMapping(value = "/user/actividade/{id}/inscritos")
    public ResponseEntity<?> AllInscritos(@PathVariable int id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) throws IOException {
        return ResponseEntity.ok(actividadeService.InscritosAll(id, page, size));
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
