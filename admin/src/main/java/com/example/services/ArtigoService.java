package com.example.services;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

import com.example.dto.artigo.ArtigoDto;
import com.example.dto.artigo.ArtigoRegister;
import com.example.utils.FilePartUtil;
import com.example.utils.ListUtil;
import java.util.Optional;
import java.util.stream.Stream;

public class ArtigoService {
    
    public static List<ArtigoDto> allArtigos() throws IOException, InterruptedException{
        String resposta=ApiService.get("/user/artigo");
        return ListUtil.fromJsonList(resposta, ArtigoDto.class);
    }

    public static ArtigoDto postArtigo(ArtigoRegister artigoRegister) throws IOException, InterruptedException {
        String resposta=ApiService.postForm("/admin/artigo", artigoRegister.toMap(),List.of(
            new FilePartUtil(Paths.get(artigoRegister.pdf()), "pdf", FilePartUtil.Formato("pdf", artigoRegister.pdf()))
        ));
        return ArtigoDto.fromJson(resposta);
    }
    
    public static ArtigoDto putArtigo(ArtigoRegister artigoRegister,int id) throws IOException, InterruptedException {
        List<FilePartUtil> parts = Stream.of(
            Optional.ofNullable(artigoRegister.pdf())
                .map(pdf -> new FilePartUtil(Paths.get(pdf), "pdf", FilePartUtil.Formato("pdf", pdf))))
        .flatMap(Optional::stream)
        .toList();
        String resposta=ApiService.putForm("/admin/artigo/"+id, artigoRegister.toMap(),parts);
        return ArtigoDto.fromJson(resposta);
    }
    
     public static boolean deleteArtigo(int id) throws IOException, InterruptedException {
        String resposta=ApiService.delete("/admin/artigo/"+id);
        return Boolean.valueOf(resposta);
    }
}
