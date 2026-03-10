package com.igreja.api.controllers;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.dto.InfoDto;
import com.igreja.api.services.InfoIgrejaService;

import javax.validation.Valid;

@RestController
public class InfoIgrejaController {

    @Autowired
    private InfoIgrejaService infoIgrejaService;

    @PostMapping(value = "/admin/info", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> register(@ModelAttribute @Valid InfoDto info) throws IOException {
        return ResponseEntity.ok(infoIgrejaService.save(info));
    }

    @GetMapping(value = "/admin/info")
    public ResponseEntity<?> viewAll() {
        return ResponseEntity.ok(infoIgrejaService.AllData());
    }

    @PostMapping(value = "/admin/info/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(@ModelAttribute @Valid InfoDto info) throws IOException {
        return ResponseEntity.ok(infoIgrejaService.update(info));
    }
}
