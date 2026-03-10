package com.igreja.api.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
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

import com.igreja.api.controllers.ActividadeController;
import com.igreja.api.enums.ActividadeType;
import com.igreja.api.enums.DuracaoActividade;
import com.igreja.api.enums.PublicoAlvoType;
import com.igreja.api.exceptions.GlobalExceptionHandler;
import com.igreja.api.models.ActividadeModel;
import com.igreja.api.services.ActividadeService;

@WebMvcTest(ActividadeController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
@ContextConfiguration(classes = {ActividadeController.class, GlobalExceptionHandler.class})
class ActividadeControllerTest {

    @Autowired
    private org.springframework.test.web.servlet.MockMvc mockMvc;

    @MockBean
    private ActividadeService actividadeService;

    @Test
    void shouldCreateActivity() throws Exception {
        ActividadeModel actividade = new ActividadeModel();
        actividade.setId(1);
        actividade.setTitulo("Culto da Juventude");
        actividade.setTema("Esperança");

        MockMultipartFile imagem = new MockMultipartFile(
                "img",
                "cartaz.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "fake-image".getBytes());

        when(actividadeService.save(any())).thenReturn(actividade);

        mockMvc.perform(multipart("/admin/actividade")
                        .file(imagem)
                        .param("descricao", "Grande encontro")
                        .param("tema", "Esperança")
                        .param("titulo", "Culto da Juventude")
                        .param("endereco", "Rua Principal")
                        .param("tipoEvento", ActividadeType.Culto.name())
                        .param("publicoAlvo", PublicoAlvoType.Todos.name())
                        .param("duracao", DuracaoActividade.Mensal.name())
                        .param("organizador", "Depto Jovem")
                        .param("dataEvento", LocalDateTime.now().plusDays(5).withNano(0).toString())
                        .param("contactos", "923000111")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.titulo").value("Culto da Juventude"));
    }

    @Test
    void shouldReturnValidationErrorForInvalidContact() throws Exception {
        MockMultipartFile imagem = new MockMultipartFile(
                "img",
                "cartaz.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "fake-image".getBytes());

        mockMvc.perform(multipart("/admin/actividade")
                        .file(imagem)
                        .param("descricao", "Grande encontro")
                        .param("tema", "Esperança")
                        .param("titulo", "Culto da Juventude")
                        .param("endereco", "Rua Principal")
                        .param("tipoEvento", ActividadeType.Culto.name())
                        .param("publicoAlvo", PublicoAlvoType.Todos.name())
                        .param("duracao", DuracaoActividade.Mensal.name())
                        .param("organizador", "Depto Jovem")
                        .param("dataEvento", LocalDateTime.now().plusDays(5).withNano(0).toString())
                        .param("contactos", "923-abc")
                        .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Dados inválidos"))
                .andExpect(jsonPath("$.details[0]").value("contactos: O campo 'contactos' deve conter apenas números."));
    }

    @Test
    void shouldListActivities() throws Exception {
        ActividadeModel actividade = new ActividadeModel();
        actividade.setId(1);
        actividade.setTitulo("Conferência");
        actividade.setTema("Fé");

        when(actividadeService.AllDataSimple(0, 10)).thenReturn(List.of());

        mockMvc.perform(get("/user/actividade"))
                .andExpect(status().isOk());
    }
}
