package com.example.services;

import com.example.dto.InscritoDto;

import java.io.IOException;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

import com.example.dto.actividade.ActividadeDtoRegister;
import com.example.dto.actividade.ActividadeDtoSimple;
import com.example.dto.comentario.ComentarioDto;
import com.example.dto.midia.MidiaActividade;
import com.example.dto.midia.MidiaSimple;
import com.example.utils.FilePartUtil;
import com.example.utils.ListUtil;
import com.example.utils.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

public class ActividadeService {

    public static List<LocalDateTime> DataActividade() throws IOException, InterruptedException{
        String resposta=ApiService.get("/admin/actividade/datas");
        
        return ListUtil.fromJsonList(resposta, LocalDateTime.class);
    }

    public static List<ActividadeDtoSimple> allActividades() throws IOException, InterruptedException{
        String resposta=ApiService.get("/user/actividade"); 
        return ListUtil.fromJsonList(resposta, ActividadeDtoSimple.class);
    }

    public static ActividadeDtoSimple postActividade(ActividadeDtoRegister actividadeDtoRegister) throws IOException, InterruptedException {
        String resposta=ApiService.postForm("/admin/actividade", actividadeDtoRegister.toMap(),List.of(
            new FilePartUtil(Paths.get(actividadeDtoRegister.img()), "img", FilePartUtil.Formato("image", actividadeDtoRegister.img()))
        ));
        return ActividadeDtoSimple.fromJson(resposta);
    }

     public static MidiaActividade galeria(MidiaActividade actividadeDtoRegister) throws IOException, InterruptedException {
        String resposta=ApiService.postForm("/admin/actividade/galeria", actividadeDtoRegister.toMap(),List.of(
            new FilePartUtil(Paths.get(actividadeDtoRegister.img()), "img", FilePartUtil.Formato("image", actividadeDtoRegister.img()))
        ));
        return MidiaActividade.fromJson(resposta);
    }

    public static MidiaActividade trailer(MidiaActividade actividadeDtoRegister) throws IOException, InterruptedException {
        String resposta=ApiService.post("/admin/actividade/trailer", actividadeDtoRegister.toMapV());
        return MidiaActividade.fromJson(resposta);
    }


     public static List<MidiaSimple> galeriaGet(int id) throws IOException, InterruptedException {
        String resposta=ApiService.get("/user/actividade/galeria/"+id);
        return ListUtil.fromJsonList(resposta,MidiaSimple.class);
    }

    public static List<MidiaSimple> trailerGet(int id) throws IOException, InterruptedException {
         String resposta=ApiService.get("/user/actividade/trailler/"+id);
        return ListUtil.fromJsonList(resposta,MidiaSimple.class);
    }

     public static boolean galeriaDel(int id) throws IOException, InterruptedException {
        String resposta=ApiService.delete("/admin/midia/"+id);
         return Boolean.valueOf(resposta);
    }

    public static boolean trailerDel(int id) throws IOException, InterruptedException {
         String resposta=ApiService.delete("/admin/midia/"+id);
         return Boolean.valueOf(resposta);
    }

     public static ActividadeDtoSimple putActividade(ActividadeDtoRegister actividadeDtoRegister,int id) throws IOException, InterruptedException {
         List<FilePartUtil> parts = Stream.of(
            Optional.ofNullable(actividadeDtoRegister.img())
                .map(img -> new FilePartUtil(Paths.get(img), "imagem", FilePartUtil.Formato("image", img))))
        .flatMap(Optional::stream)
        .toList();
        String resposta=ApiService.putForm("/admin/actividade/"+id, actividadeDtoRegister.toMap(),parts);
        return ActividadeDtoSimple.fromJson(resposta);
    }


    public static boolean deleteActividade(int id) throws IOException, InterruptedException {
        String resposta=ApiService.delete("/admin/actividade/"+id);
        return Boolean.valueOf(resposta);
    }
    
    public static List<InscritoDto> getInscritos(int id) throws IOException, InterruptedException {
        String resposta=ApiService.get("/user/actividade/"+id+"/inscritos");
        return ListUtil.fromJsonList(resposta, InscritoDto.class);
    }

     public static List<ComentarioDto> getComentarios(int id,boolean analise) throws IOException, InterruptedException {
        String resposta=ApiService.get("/user/actividade/"+id+"/comentarios/"+analise);
        return ListUtil.fromJsonList(resposta, ComentarioDto.class);
    }

     public static List<ComentarioDto> getComentariosAll(int id) throws IOException, InterruptedException {
        String resposta=ApiService.get("/user/actividade/"+id+"/comentarios");
        return ListUtil.fromJsonList(resposta, ComentarioDto.class);
    }

}
