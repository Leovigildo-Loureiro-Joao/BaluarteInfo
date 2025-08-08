package com.example.dto.actividade;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import com.example.enums.ActividadeType;
import com.example.enums.DuracaoActividade;
import com.example.enums.PublicoAlvoType;


public record ActividadeDtoRegister(
    String descricao,
    String tema,
    String titulo,
    String endereco,
    ActividadeType tipoEvento,
    PublicoAlvoType publicoAlvo,
    DuracaoActividade tipo,
    String organizador,
    LocalDateTime dataEvento,
    String contactos,
    String img
    ) {

        public Map<String, String> toMap() {
            Map<String, String> map = new HashMap<>();
            map.put("titulo", titulo);
            map.put("tema", tema);
            map.put("descricao", descricao);
            map.put("endereco", endereco);
            map.put("tipoEvento", tipoEvento.name());
            map.put("publicoAlvo", publicoAlvo.name());
            map.put("organizador", organizador);
            map.put("duracao", tipo.name());
            map.put("dataEvento", dataEvento.toString());
            map.put("contactos", contactos);
            System.out.println(map);
            return map;
        }
    
}