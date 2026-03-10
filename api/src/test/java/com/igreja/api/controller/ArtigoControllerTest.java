package com.igreja.api.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
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

import com.igreja.api.controllers.ArtigoController;
import com.igreja.api.dto.comentario.ComentarioResult;
import com.igreja.api.enums.ArtigoType;
import com.igreja.api.exceptions.GlobalExceptionHandler;
import com.igreja.api.models.ArtigoModel;
import com.igreja.api.services.ArtigoService;

@WebMvcTest(ArtigoController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
@ContextConfiguration(classes = {ArtigoController.class, GlobalExceptionHandler.class})
class ArtigoControllerTest {

    @Autowired
    private org.springframework.test.web.servlet.MockMvc mockMvc;

    @MockBean
    private ArtigoService artigoService;

    @Test
    void shouldCreateArticle() throws Exception {
        ArtigoModel artigo = new ArtigoModel();
        artigo.setId(1);
        artigo.setTitulo("Estudo de João");
        artigo.setDescricao("Conteúdo");
        artigo.setEscritor("Pastor Leo");
        artigo.setPdf("https://cdn/artigo.pdf");
        artigo.setImg("https://cdn/capa.jpg");
        artigo.setTipo(ArtigoType.BIBLE_STUDY);
        artigo.setNPagina(12);
        artigo.setDataPublicacao(LocalDateTime.now());

        MockMultipartFile pdf = new MockMultipartFile(
                "pdf",
                "estudo.pdf",
                MediaType.APPLICATION_PDF_VALUE,
                "fake-pdf".getBytes());

        when(artigoService.save(any())).thenReturn(artigo);

        mockMvc.perform(multipart("/admin/artigo")
                        .file(pdf)
                        .param("descricao", "Conteúdo")
                        .param("titulo", "Estudo de João")
                        .param("escritor", "Pastor Leo")
                        .param("tipo", ArtigoType.BIBLE_STUDY.name())
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.titulo").value("Estudo de João"));
    }

    @Test
    void shouldListArticles() throws Exception {
        ArtigoModel artigo = new ArtigoModel();
        artigo.setId(1);
        artigo.setTitulo("Estudo");

        when(artigoService.AllData(10, 0)).thenReturn(List.of());

        mockMvc.perform(get("/user/artigo"))
                .andExpect(status().isOk());
    }

    @Test
    void shouldListArticleComments() throws Exception {
        when(artigoService.ComentariosAll(1)).thenReturn(List.of(
                new ComentarioResult(1, "https://cdn/avatar.jpg", "João", "Muito bom", true)));

        mockMvc.perform(get("/user/artigo/1/comentarioAll"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].descricao").value("Muito bom"));
    }

    @Test
    void shouldReturnFriendlyErrorWhenArticleAlreadyExists() throws Exception {
        MockMultipartFile pdf = new MockMultipartFile(
                "pdf",
                "estudo.pdf",
                MediaType.APPLICATION_PDF_VALUE,
                "fake-pdf".getBytes());

        when(artigoService.save(any()))
                .thenThrow(new ResponseStatusException(org.springframework.http.HttpStatus.CONFLICT, "Artigo já existe."));

        mockMvc.perform(multipart("/admin/artigo")
                        .file(pdf)
                        .param("descricao", "Conteúdo")
                        .param("titulo", "Estudo de João")
                        .param("escritor", "Pastor Leo")
                        .param("tipo", ArtigoType.BIBLE_STUDY.name())
                        .with(csrf()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Artigo já existe."));
    }

    @Test
    void shouldReturnValidationErrorWhenTitleMissing() throws Exception {
        MockMultipartFile pdf = new MockMultipartFile(
                "pdf",
                "estudo.pdf",
                MediaType.APPLICATION_PDF_VALUE,
                "fake-pdf".getBytes());

        mockMvc.perform(multipart("/admin/artigo")
                        .file(pdf)
                        .param("descricao", "Conteúdo")
                        .param("escritor", "Pastor Leo")
                        .param("tipo", ArtigoType.BIBLE_STUDY.name())
                        .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Dados inválidos"));
    }
}
