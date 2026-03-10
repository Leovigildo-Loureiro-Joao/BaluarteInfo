package com.igreja.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.services.VistosService;

@RestController
@RequestMapping("/user/vistos")
public class VistoController {

    private final VistosService vistosService;

    public VistoController(VistosService vistosService) {
        this.vistosService = vistosService;
    }

    @GetMapping("/artigo/{id}")
    public ResponseEntity<?> countArticleViews(@PathVariable(name = "id") int articleId) {
        return ResponseEntity.ok(vistosService.countArticleViews(articleId));
    }

    @GetMapping("/midia/{id}")
    public ResponseEntity<?> countMediaViews(@PathVariable(name = "id") int mediaId) {
        return ResponseEntity.ok(vistosService.countMediaViews(mediaId));
    }
}
