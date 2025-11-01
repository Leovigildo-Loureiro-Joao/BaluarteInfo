package com.example.services;

import java.io.IOException;
import java.util.List;

import com.example.enums.ConfigType;
import com.example.models.config.ConfigDto;
import com.example.models.config.Statics_Mapper;
import com.example.utils.ListUtil;

public class ConfigService {
    public static List<ConfigDto> get() throws IOException, InterruptedException{
        String resposta=ApiService.get("/admin/config/all");
        return ListUtil.fromJsonList(resposta, ConfigDto.class);
    }

     public static ConfigDto put(ConfigDto dto) throws IOException, InterruptedException{
         String resposta=ApiService.put("/admin/config/edit",dto.toMap());
        return ConfigDto.fromJson(resposta);
    }
}
