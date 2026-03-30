package com.igreja.api.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.igreja.api.dto.salvacao.SalvacaoDto;
import com.igreja.api.services.CloudDinaryService;
import com.igreja.api.services.SalvacaoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SalvacaoController {

    private final SalvacaoService salvacaoService;
    private final CloudDinaryService cloudinaryService;

    @GetMapping("/public/salvacao")
    public ResponseEntity<SalvacaoDto> getPublic() {
        return ResponseEntity.ok(salvacaoService.get());
    }

    @GetMapping("/admin/salvacao")
    public ResponseEntity<SalvacaoDto> getAdmin() {
        return ResponseEntity.ok(salvacaoService.get());
    }

    @PutMapping("/admin/salvacao")
    public ResponseEntity<SalvacaoDto> save(@RequestBody SalvacaoDto dto) {
        return ResponseEntity.ok(salvacaoService.save(dto));
    }

    public record UploadResponse(String url) {
    }

    @PostMapping(value = "/admin/salvacao/cover-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadResponse> uploadCover(@RequestParam("file") MultipartFile file) throws Exception {
        cloudinaryService.generateUniqueName(file.getOriginalFilename());
        String url = cloudinaryService.uploadFileAsync(file, "image");
        return ResponseEntity.ok(new UploadResponse(url));
    }
}

