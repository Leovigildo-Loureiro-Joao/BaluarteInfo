package com.igreja.api.dto.midia;

import org.apache.hc.client5.http.entity.mime.MultipartPart;

import com.igreja.api.enums.MidiaType;

public record MidiaActividadeV(int id,String titulo,MidiaType type,String img) {
    
}
