package com.example.services;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

import com.example.dto.artigo.ArtigoDto;
import com.example.dto.artigo.ArtigoRegister;
import com.example.utils.FilePartUtil;
import com.example.utils.ListUtil;

public class ArtigoService {
    
    public List<ArtigoDto> allArtigos() throws IOException, InterruptedException{
        String resposta=ApiService.get("/user/artigo");
        return ListUtil.fromJsonList(resposta, ArtigoDto.class);
    }

    public ArtigoDto postArtigo(ArtigoRegister artigoRegister) throws IOException, InterruptedException {
        String resposta=ApiService.postForm("/admin/artigo", artigoRegister.toMap(),List.of(
            new FilePartUtil(Paths.get(artigoRegister.pdf()), "pdf", FilePartUtil.Formato("pdf", artigoRegister.pdf()))
        ));
        return ArtigoDto.fromJson(resposta);
    }
}
