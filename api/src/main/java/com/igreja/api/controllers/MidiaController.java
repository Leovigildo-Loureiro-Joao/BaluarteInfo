package com.igreja.api.controllers;

import java.io.IOException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;

import javax.sound.sampled.UnsupportedAudioFileException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.dto.PageResponse;
import com.igreja.api.dto.midia.MidiaActividade;
import com.igreja.api.dto.midia.MidiaActividadeV;
import com.igreja.api.dto.midia.MidiaDetailDto;
import com.igreja.api.dto.midia.MidiaDto;
import com.igreja.api.dto.midia.MidiaFile;
import com.igreja.api.dto.midia.MidiaRelacionadoEdicaoItem;
import com.igreja.api.dto.midia.MidiaRelacionadosDto;
import com.igreja.api.dto.midia.MidiaViewRequest;
import com.igreja.api.services.MidiaService;
import com.igreja.api.enums.AudioType;
import com.igreja.api.enums.MidiaType;
import com.igreja.api.enums.VideoType;
import com.igreja.api.services.AdminAuditLogService;
import com.igreja.api.enums.AdminAuditType;


import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.servlet.http.HttpServletRequest;

@RestController
public class MidiaController {
    
    @Autowired
    private MidiaService midiaService;

    @Autowired
    private AdminAuditLogService adminAuditLogService;


    @PostMapping(value = "/admin/midia/video", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> REgisterMidiaVideoFile(
            @ModelAttribute @Valid MidiaFile midiaDto,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) throws InterruptedException, ExecutionException, TimeoutException, UnsupportedAudioFileException, IOException {
        var result = midiaService.save(midiaDto);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Mídia criada",
                    "Novo vídeo (arquivo) publicado", resolveIp(request), AdminAuditType.SUCESSO);
        }
        return ResponseEntity.ok(midiaService.SelectDetail(result.getId()));
    }

    @PostMapping(value = "/admin/midia/audio",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> REgisterMidiaFile(
            @ModelAttribute @Valid MidiaFile midiaDto,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) throws InterruptedException, ExecutionException, TimeoutException, UnsupportedAudioFileException, IOException {
        var result = midiaService.save(midiaDto);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Mídia criada",
                    "Novo áudio publicado", resolveIp(request), AdminAuditType.SUCESSO);
        }
        return ResponseEntity.ok(midiaService.SelectDetail(result.getId()));
    }

    @GetMapping("/user/midia/video")
    public ResponseEntity<?> AllDataVideo(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {    
        return ResponseEntity.ok(midiaService.AllVideo(page, size));
    }

    @GetMapping("/user/midia/audio")
    public ResponseEntity<?> AllDataAudios(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {    
        return ResponseEntity.ok(midiaService.AllAudio(page, size));
    }

    @GetMapping("/user/midia")
    public ResponseEntity<?> AllMidia(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) MidiaType type,
            @RequestParam(required = false) AudioType audioType,
            @RequestParam(required = false) VideoType videoType,
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(midiaService.page(page, size, type, audioType, videoType, q));
    }

    @GetMapping("/admin/midia")
    public ResponseEntity<?> AllMidiaAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) MidiaType type,
            @RequestParam(required = false) AudioType audioType,
            @RequestParam(required = false) VideoType videoType,
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(midiaService.page(page, size, type, audioType, videoType, q));
    }

    @GetMapping("/admin/galeria")
    public ResponseEntity<?> galeriaAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(midiaService.galeriaAdmin(page, size, q));
    }

    @PutMapping(value = "/admin/midia/video/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> EditVideoFile(
            @PathVariable("id") int id,
            @ModelAttribute @Valid MidiaFile midiaDto,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) throws InterruptedException, ExecutionException, TimeoutException, UnsupportedAudioFileException, IOException {
        var result = midiaService.edit(midiaDto, id);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Mídia editada",
                    "Vídeo (arquivo) ID " + id + " atualizado", resolveIp(request), AdminAuditType.INFO);
        }
        return ResponseEntity.ok(midiaService.SelectDetail(result.getId()));
    }

    @PutMapping(value="/admin/midia/audio/{id}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> EditComentario(
            @PathVariable("id") int id,
            @ModelAttribute @Valid MidiaFile midiaDto,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) throws InterruptedException, ExecutionException, TimeoutException, UnsupportedAudioFileException, IOException {
        var result = midiaService.edit(midiaDto,id);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Mídia editada",
                    "Áudio/Imagem ID " + id + " atualizado", resolveIp(request), AdminAuditType.INFO);
        }
        return ResponseEntity.ok(midiaService.SelectDetail(result.getId()));
    }

    @DeleteMapping("/admin/midia/{id}")
    public ResponseEntity<?> Delete(
            @PathVariable("id") int id,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) {
        midiaService.delete(id);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Mídia removida",
                    "Mídia ID " + id + " removida", resolveIp(request), AdminAuditType.ALERTA);
        }
        return ResponseEntity.ok(true);
    }

    @GetMapping(value = "/user/midia/{id}/comentarioAll")
    public ResponseEntity<?> AllComentarios(@PathVariable int id) throws IOException {
        return ResponseEntity.ok(midiaService.ComentariosAll(id));
    }


    @GetMapping(value = "/user/midia/{id}")
    public ResponseEntity<?> SelectComentario(@PathVariable int id) throws IOException {
        MidiaDetailDto detail = midiaService.SelectDetail(id);
        return ResponseEntity.ok(detail);
    }

    @GetMapping(value = "/user/midia/{id}/relacionados")
    public ResponseEntity<MidiaRelacionadosDto> relacionados(
            @PathVariable int id,
            @RequestParam(defaultValue = "8") int size) {
        return ResponseEntity.ok(midiaService.relacionados(id, size));
    }

    @GetMapping(value = "/user/midia/{id}/relacionados-edicoes")
    public ResponseEntity<PageResponse<MidiaRelacionadoEdicaoItem>> relacionadosEdicoes(
            @PathVariable int id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(midiaService.relacionadosPorEdicoes(id, page, size));
    }

    @PostMapping(value = "/user/me/midia/{id}/view")
    public ResponseEntity<?> registerMidiaView(
            @PathVariable int id,
            @RequestBody(required = false) MidiaViewRequest payload,
            @AuthenticationPrincipal UserDetails viewer,
            HttpServletRequest request) {
        Integer watchedSeconds = payload == null ? null : payload.watchedSeconds();
        return ResponseEntity.ok(midiaService.registerView(id, resolveIp(request), request.getHeader("User-Agent"), viewer, watchedSeconds));
    }

    // Alias sem "/me" para suportar contagem de view sem autenticação.
    @PostMapping(value = "/user/midia/{id}/view")
    public ResponseEntity<?> registerMidiaViewPublic(
            @PathVariable int id,
            @RequestBody(required = false) MidiaViewRequest payload,
            @AuthenticationPrincipal UserDetails viewer,
            HttpServletRequest request) {
        Integer watchedSeconds = payload == null ? null : payload.watchedSeconds();
        return ResponseEntity.ok(midiaService.registerView(id, resolveIp(request), request.getHeader("User-Agent"), viewer, watchedSeconds));
    }

    @PostMapping(value = "/admin/actividade/trailer")
    public ResponseEntity<?> trailer(
            @RequestBody @Valid MidiaActividadeV actividadeDto,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) throws InterruptedException, ExecutionException, TimeoutException, UnsupportedAudioFileException, IOException {
        var result = midiaService.addMidia(actividadeDto);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Upload de trailer",
                    "Trailer adicionado à atividade ID " + actividadeDto.id(), resolveIp(request), AdminAuditType.SUCESSO);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/admin/actividade/galeria",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> galeria(
            @ModelAttribute @Valid MidiaActividade actividadeDto,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) throws InterruptedException, ExecutionException, TimeoutException, UnsupportedAudioFileException, IOException {
        var result = midiaService.addMidia(actividadeDto);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Upload de galeria",
                    "Imagem adicionada à atividade ID " + actividadeDto.id(), resolveIp(request), AdminAuditType.SUCESSO);
        }
        return ResponseEntity.ok(result);
    }

     @GetMapping(value = "/user/actividade/galeria/{id}")
    public ResponseEntity<?> galeriaGet(@PathVariable int id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) throws IOException {
        return ResponseEntity.ok(midiaService.Galeria(id,page,size));
    }

    @GetMapping(value = "/user/actividade/trailler/{id}")
    public ResponseEntity<?> traillerGet(@PathVariable int id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) throws IOException {
        return ResponseEntity.ok(midiaService.Trailler(id,page,size));
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
