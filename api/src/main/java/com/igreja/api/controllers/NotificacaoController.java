package com.igreja.api.controllers;

import java.util.Map;

import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.services.NotificacaoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
public class NotificacaoController {

    private final NotificacaoService service;

    public NotificacaoController(NotificacaoService service) {
        this.service = service;
    }

    @GetMapping("/admin/notificacao")
    public ResponseEntity<?> unreadNotifications() {
        return ResponseEntity.ok(service.unread());
    }

    @GetMapping("/admin/notificacao/all")
    public ResponseEntity<?> allNotifications() {
        return ResponseEntity.ok(service.all());
    }

    @DeleteMapping("/admin/notificacao")
    public ResponseEntity<?> deleteReadNotifications() {
        int deletedCount = service.deleteRead();
        return ResponseEntity.ok(Map.of(
                "message", "Notificações lidas removidas com sucesso.",
                "deleted", deletedCount));
    }

    @PutMapping("/admin/notificacao/{id}/ler")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable int id) {
        return ResponseEntity.ok(service.markAsRead(id));
    }
}
