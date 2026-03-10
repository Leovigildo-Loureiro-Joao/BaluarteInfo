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

import com.igreja.api.dto.midia.MidiaActividade;
import com.igreja.api.dto.midia.MidiaActividadeV;
import com.igreja.api.dto.midia.MidiaDto;
import com.igreja.api.dto.midia.MidiaFile;
import com.igreja.api.services.MidiaService;


import jakarta.validation.Valid;

@RestController
public class MidiaController {
    
    @Autowired
    private MidiaService midiaService;


    @PostMapping("/admin/midia/video")
    public ResponseEntity<?> REgisterMidia(@RequestBody @Valid MidiaDto midiaDto) {    
        return ResponseEntity.ok(midiaService.save(midiaDto));
    }

    @PostMapping(value = "/admin/midia/audio",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> REgisterMidiaFile(@ModelAttribute @Valid MidiaFile midiaDto) throws InterruptedException, ExecutionException, TimeoutException, UnsupportedAudioFileException, IOException {    
        return ResponseEntity.ok(midiaService.save(midiaDto));
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

    @PutMapping("/admin/midia/video/{id}")
    public ResponseEntity<?> EditComentario(@PathVariable("id") int id,@RequestBody @Valid MidiaDto midiaDto) {    
        return ResponseEntity.ok(midiaService.edit(midiaDto,id));
    }

    @PutMapping(value="/admin/midia/audio/{id}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> EditComentario(@PathVariable("id") int id,@ModelAttribute @Valid MidiaFile midiaDto) throws InterruptedException, ExecutionException, TimeoutException {    
        return ResponseEntity.ok(midiaService.edit(midiaDto,id));
    }

    @DeleteMapping("/admin/midia/{id}")
    public ResponseEntity<?> Delete(@PathVariable("id") int id) {    
        midiaService.delete(id);
        return ResponseEntity.ok(true);
    }

    @GetMapping(value = "/user/midia/{id}/comentarioAll")
    public ResponseEntity<?> AllComentarios(@PathVariable int id) throws IOException {
        return ResponseEntity.ok(midiaService.ComentariosAll(id));
    }


    @GetMapping(value = "/user/midia/{id}")
    public ResponseEntity<?> SelectComentario(@PathVariable int id) throws IOException {
        return ResponseEntity.ok(midiaService.Select(id));
    }

    @PostMapping(value = "/admin/actividade/trailer")
    public ResponseEntity<?> trailer(@RequestBody @Valid MidiaActividadeV actividadeDto) throws InterruptedException, ExecutionException, TimeoutException, UnsupportedAudioFileException, IOException {
        return ResponseEntity.ok(midiaService.addMidia(actividadeDto));
    }

    @PostMapping(value = "/admin/actividade/galeria",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> galeria(@ModelAttribute @Valid MidiaActividade actividadeDto) throws InterruptedException, ExecutionException, TimeoutException, UnsupportedAudioFileException, IOException {
        return ResponseEntity.ok(midiaService.addMidia(actividadeDto));
    }

     @GetMapping(value = "/user/actividade/galeria/{id}")
    public ResponseEntity<?> galeriaGet(@PathVariable int id) throws IOException {
        return ResponseEntity.ok(midiaService.Galeria(id));
    }

    @GetMapping(value = "/user/actividade/trailler/{id}")
    public ResponseEntity<?> traillerGet(@PathVariable int id) throws IOException {
        return ResponseEntity.ok(midiaService.Trailler(id));
    }
}
