package com.igreja.api.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.services.NotificacaoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
public class NotificacaoController {

    @Autowired
    private NotificacaoService service;
    
    @GetMapping("/admin/notificacao")
    public ResponseEntity<?> LidoNotification() {
        return ResponseEntity.ok().body(service.Lido());
    }

    @GetMapping("/admin/notificacaoAll")
    public ResponseEntity<?> AllNotification() {
        return ResponseEntity.ok().body(service.All());
    }

    @DeleteMapping("/admin/notificacao")
    public ResponseEntity<?> DeleteNotificacaoLida() {
        return ResponseEntity.ok().body(service.ApagarLido());
    }

    @PutMapping("/admin/notificacao/{id}/ler")
    public ResponseEntity<?> EditNotification(@PathVariable int id) {
        return ResponseEntity.ok().body(service.Ler(id));
    }
    

}
