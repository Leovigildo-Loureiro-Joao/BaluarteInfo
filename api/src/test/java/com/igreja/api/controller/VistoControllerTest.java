package com.igreja.api.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;
import java.util.NoSuchElementException;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;

import com.igreja.api.controllers.VistoController;
import com.igreja.api.exceptions.GlobalExceptionHandler;
import com.igreja.api.services.VistosService;

@WebMvcTest(VistoController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
@ContextConfiguration(classes = {VistoController.class, GlobalExceptionHandler.class})
class VistoControllerTest {

    @Autowired
    private org.springframework.test.web.servlet.MockMvc mockMvc;

    @MockBean
    private VistosService vistosService;

    @Test
    void shouldCountArticleViews() throws Exception {
        when(vistosService.countArticleViews(1)).thenReturn(Map.of("total", 12L));

        mockMvc.perform(get("/user/vistos/artigo/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(12));
    }

    @Test
    void shouldCountMediaViews() throws Exception {
        when(vistosService.countMediaViews(2)).thenReturn(Map.of("total", 7L));

        mockMvc.perform(get("/user/vistos/midia/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(7));
    }

    @Test
    void shouldReturnFriendlyErrorWhenArticleDoesNotExist() throws Exception {
        when(vistosService.countArticleViews(99))
                .thenThrow(new NoSuchElementException("Artigo não encontrado."));

        mockMvc.perform(get("/user/vistos/artigo/99"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Requisição inválida"))
                .andExpect(jsonPath("$.message").value("Artigo não encontrado."));
    }

    @Test
    void shouldReturnFriendlyErrorWhenMediaDoesNotExist() throws Exception {
        when(vistosService.countMediaViews(77))
                .thenThrow(new NoSuchElementException("Mídia não encontrada."));

        mockMvc.perform(get("/user/vistos/midia/77"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Requisição inválida"))
                .andExpect(jsonPath("$.message").value("Mídia não encontrada."));
    }
}
