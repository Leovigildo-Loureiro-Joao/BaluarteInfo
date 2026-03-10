package com.igreja.api.dto.midia;

import org.apache.hc.client5.http.entity.mime.MultipartPart;
import org.springframework.web.multipart.MultipartFile;

import com.igreja.api.enums.MidiaType;

public record MidiaActividade(int id,String titulo,MidiaType type,MultipartFile img) {
    
}
