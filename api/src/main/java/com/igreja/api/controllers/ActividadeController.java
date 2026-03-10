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
import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.dto.actividade.ActividadeDto;
import com.igreja.api.services.ActividadeService;

import jakarta.validation.Valid;

@RestController
public class ActividadeController {
    
    @Autowired
    private ActividadeService actividadeService;

    @PostMapping(value = "/admin/actividade",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> Register(@ModelAttribute @Valid ActividadeDto actividadeDto) throws IOException, InterruptedException, ExecutionException, TimeoutException {
        return ResponseEntity.ok(actividadeService.save(actividadeDto));
    }

   

    @DeleteMapping(value = "/admin/actividade/{id}")
    public ResponseEntity<?> Delete(@PathVariable(name = "id") int id) throws IOException {
        return ResponseEntity.ok(actividadeService.delete(id));
    }

    @PutMapping(value = "/admin/actividade/{id}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> Editar(@PathVariable(name = "id") int id,@ModelAttribute @Valid ActividadeDto actividadeDto) throws IOException, InterruptedException, ExecutionException, TimeoutException {
        return ResponseEntity.ok(actividadeService.edit(id,actividadeDto));
    }

    @GetMapping(value = "/user/actividade")
    public ResponseEntity<?> AllActividades( @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) throws IOException {
        return ResponseEntity.ok(actividadeService.AllDataSimple(page, size));
    }

    @GetMapping(value = "/user/actividade/{id}")
    public ResponseEntity<?> SelectArigo(@PathVariable int id) throws IOException {
        return ResponseEntity.ok(actividadeService.Select(id));
    }

    @GetMapping(value = "/admin/actividade/datas")
    public ResponseEntity<?> DatasMarcadas() throws IOException {
        return ResponseEntity.ok(actividadeService.AllDataActividade());
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
    public ResponseEntity<?> AllInscritos(@PathVariable int id) throws IOException {
        return ResponseEntity.ok(actividadeService.InscritosAll(id));
    }



}
