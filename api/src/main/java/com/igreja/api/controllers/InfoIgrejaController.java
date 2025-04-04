package com.igreja.api.controllers;

import java.io.IOException;
import java.util.NoSuchElementException;

import javax.validation.Valid;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.dto.InfoDto;
import com.igreja.api.services.InfoIgrejaService;

@RestController
public class InfoIgrejaController {

    @Autowired
    private InfoIgrejaService infoIgrejaService;

    @PostMapping(value = "/admin/info/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> register(@ModelAttribute @Valid InfoDto info) throws IOException {
        try {
            var infos=infoIgrejaService.save(info);
            return ResponseEntity.ok(infos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
     
    }

    @PostMapping(value = "/user/info/all")
    public ResponseEntity<?> viewAll() {
        try {
            return ResponseEntity.ok(infoIgrejaService.AllData());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
     
    }

    @PostMapping(value = "/admin/info/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(@ModelAttribute @Valid InfoDto info) throws IOException {
        try {
            var infos=infoIgrejaService.update(info);
            return ResponseEntity.ok(infos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
     
    }
}
