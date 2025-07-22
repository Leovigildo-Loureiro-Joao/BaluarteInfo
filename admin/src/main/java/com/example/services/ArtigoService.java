package com.example.services;

import java.io.IOException;
import java.util.List;

import com.example.models.artigo.ArtigoDto;
import com.example.utils.ListUtil;

public class ArtigoService {
    
    public List<ArtigoDto> allArtigos() throws IOException, InterruptedException{
        String resposta=ApiService.get("/user/artigo");
        return ListUtil.fromJsonList(resposta, ArtigoDto.class);
    }
}
