package com.igreja.api.controllers;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.dto.midia.ConnectMidiaDto;
import com.igreja.api.dto.midia.MidiaDto;
import com.igreja.api.dto.midia.MidiaFile;
import com.igreja.api.services.MidiaService;


import jakarta.validation.Valid;

@RestController
public class MidiaController {
    
    @Autowired
    private MidiaService midiaService;


    @PostMapping("/admin/midia/register/video")
    public ResponseEntity<?> REgisterMidia(@RequestBody @Valid MidiaDto midiaDto) {    
       try {
            return ResponseEntity.ok(midiaService.save(midiaDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping(value = "/admin/midia/register/audio",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> REgisterMidiaFile(@ModelAttribute @Valid MidiaFile midiaDto) {    
       try {
            return ResponseEntity.ok(midiaService.save(midiaDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/admin/midia/videos")
    public ResponseEntity<?> AllDataVideo() {    
       try {
            return ResponseEntity.ok(midiaService.AllVideo());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/admin/midia/audios")
    public ResponseEntity<?> AllDataAudios() {    
       try {
            return ResponseEntity.ok(midiaService.AllAudio());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/admin/midia/edit/{id}")
    public ResponseEntity<?> EditComentario(@PathVariable("id") int id,@RequestBody @Valid MidiaDto midiaDto) {    
       try {
            return ResponseEntity.ok(midiaService.edit(midiaDto,id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping(value="/admin/midia/editFile/{id}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> EditComentario(@PathVariable("id") int id,@ModelAttribute @Valid MidiaFile midiaDto) {    
       try {
            return ResponseEntity.ok(midiaService.edit(midiaDto,id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } 
    }

    @DeleteMapping("/admin/midia/delete/{id}")
    public ResponseEntity<?> DeleteComentario(@PathVariable("id") int id) {    
       try {
            midiaService.delete(id);
            return ResponseEntity.ok("Deletado");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping(value = "/user/midia/{id}/comentarioAll")
    public ResponseEntity<?> AllComentarios(@PathVariable int id) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(midiaService.ComentariosAll(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @GetMapping(value = "/user/midia/{id}")
    public ResponseEntity<?> SelectComentario(@PathVariable int id) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(midiaService.Select(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping(value = "/admin/midia/connect")
    public ResponseEntity<?> ConnectActividade(@RequestBody @Valid ConnectMidiaDto connect) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(midiaService.ConnectActividade(connect));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}