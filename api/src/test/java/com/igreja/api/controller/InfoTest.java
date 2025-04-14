package com.igreja.api.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.File;
import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import org.springframework.http.MediaType;

@SpringBootTest
@AutoConfigureMockMvc
public class InfoTest {
    
     @Autowired
    private MockMvc mockMvc;
      @Autowired
    private Cloudinary cloudinary;

     @Test
    public void deveRetornarInformacoes() throws Exception {
        Map result = cloudinary.uploader().upload(new File("C:\\Users\\Familia_LJ\\Documents\\GitHub\\BaluarteInfo\\api\\0ce452a0-3788-491e-887d-487da6eadf3e_conteudo.png"), ObjectUtils.emptyMap());
        System.out.println(result);
    }
}
