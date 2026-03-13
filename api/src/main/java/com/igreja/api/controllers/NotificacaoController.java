package com.igreja.api.controllers;

import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.dto.PageResponse;
import com.igreja.api.services.NotificacaoService;

@RestController
public class NotificacaoController {

    private final NotificacaoService service;

    public NotificacaoController(NotificacaoService service) {
        this.service = service;
    }

    @GetMapping("/admin/notificacao")
    public ResponseEntity<?> unreadNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        var pageable = PageRequest.of(page, size, Sort.by("dataNotificacao").descending());
        var result = service.page(true, pageable);
        return ResponseEntity.ok(new PageResponse<>(result.getContent(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages()));
    }

    @GetMapping("/admin/notificacao/all")
    public ResponseEntity<?> allNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        var pageable = PageRequest.of(page, size, Sort.by("dataNotificacao").descending());
        var result = service.page(false, pageable);
        return ResponseEntity.ok(new PageResponse<>(result.getContent(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages()));
    }

    @DeleteMapping("/admin/notificacao")
    public ResponseEntity<?> deleteReadNotifications(  @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        int deletedCount = service.deleteRead(page,size);
        return ResponseEntity.ok(Map.of(
                "message", "Notificações lidas removidas com sucesso.",
                "deleted", deletedCount));
    }

    @PutMapping("/admin/notificacao/{id}/ler")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable int id) {
        return ResponseEntity.ok(service.markAsRead(id));
    }
}
