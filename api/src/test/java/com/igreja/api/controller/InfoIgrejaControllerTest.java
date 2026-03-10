package com.igreja.api.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.IOException;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.web.server.ResponseStatusException;

import com.igreja.api.controllers.InfoIgrejaController;
import com.igreja.api.enums.InfoType;
import com.igreja.api.exceptions.GlobalExceptionHandler;
import com.igreja.api.models.InfoIgrejaModel;
import com.igreja.api.services.InfoIgrejaService;

@WebMvcTest(InfoIgrejaController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
@ContextConfiguration(classes = {InfoIgrejaController.class, GlobalExceptionHandler.class})
class InfoIgrejaControllerTest {

    @Autowired
    private org.springframework.test.web.servlet.MockMvc mockMvc;

    @MockBean
    private InfoIgrejaService infoIgrejaService;

    @Test
    void shouldListAllInfos() throws Exception {
        InfoIgrejaModel info = new InfoIgrejaModel();
        info.setId(1);
        info.setType(InfoType.QuemSomos);
        info.setDescricao("Somos a igreja.");
        info.setImg("https://cdn/imagem.jpg");

        when(infoIgrejaService.AllData()).thenReturn(List.of(info));

        mockMvc.perform(get("/admin/info"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].type").value("QuemSomos"))
                .andExpect(jsonPath("$[0].descricao").value("Somos a igreja."));
    }

    @Test
    void shouldCreateInfoWithMultipart() throws Exception {
        InfoIgrejaModel info = new InfoIgrejaModel();
        info.setId(2);
        info.setType(InfoType.Salvacao);
        info.setDescricao("Plano da salvação.");
        info.setImg("https://cdn/salvacao.jpg");

        MockMultipartFile imagem = new MockMultipartFile(
                "img",
                "salvacao.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "fake-image".getBytes());

        when(infoIgrejaService.save(any())).thenReturn(info);

        mockMvc.perform(multipart("/admin/info")
                        .file(imagem)
                        .param("type", "Salvacao")
                        .param("descricao", "Plano da salvação.")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.type").value("Salvacao"));
    }

    @Test
    void shouldReturnFriendlyErrorWhenInfoAlreadyExists() throws Exception {
        MockMultipartFile imagem = new MockMultipartFile(
                "img",
                "quem-somos.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "fake-image".getBytes());

        when(infoIgrejaService.save(any()))
                .thenThrow(new ResponseStatusException(org.springframework.http.HttpStatus.CONFLICT,
                        "Já existe uma informação cadastrada para este tipo."));

        mockMvc.perform(multipart("/admin/info")
                        .file(imagem)
                        .param("type", "QuemSomos")
                        .param("descricao", "Texto institucional.")
                        .with(csrf()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value("Já existe uma informação cadastrada para este tipo."))
                .andExpect(jsonPath("$.path").value("/admin/info"));
    }

    @Test
    void shouldReturnValidationErrorWhenDescricaoIsMissing() throws Exception {
        mockMvc.perform(multipart("/admin/info")
                        .param("type", "MissaoVisao")
                        .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Dados inválidos"))
                .andExpect(jsonPath("$.details[0]").exists());
    }
}
