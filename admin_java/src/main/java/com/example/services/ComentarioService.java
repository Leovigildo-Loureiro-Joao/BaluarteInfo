package com.example.services;

import java.io.IOException;
import java.util.List;

import com.example.dto.comentario.Analise;
import com.example.dto.comentario.ComentarioDto;
import com.example.utils.ListUtil;

public class ComentarioService {
    
   

     public static ComentarioDto find(int id) throws IOException, InterruptedException {
        String resposta=ApiService.get("/user/comentario/"+id);
        return  ComentarioDto.fromJson(resposta);
    }

     public static ComentarioDto Analisar(Analise analise) throws IOException, InterruptedException {
        String resposta=ApiService.put("/admin/comentario/analise",analise.toMap());
        return ComentarioDto.fromJson(resposta);
    }

    public static void Apagar(int id) throws IOException, InterruptedException {
        ApiService.delete("/user/comentario/"+id);
    }

    
}
