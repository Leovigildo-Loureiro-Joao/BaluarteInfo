package com.igreja.api.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;

import com.igreja.api.controllers.MensagemController;
import com.igreja.api.enums.StatusMensage;
import com.igreja.api.exceptions.GlobalExceptionHandler;
import com.igreja.api.models.MensagensModel;
import com.igreja.api.services.MensagemService;

@WebMvcTest(MensagemController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
@ContextConfiguration(classes = {MensagemController.class, GlobalExceptionHandler.class})
class MensagemControllerTest {

    @Autowired
    private org.springframework.test.web.servlet.MockMvc mockMvc;

    @MockBean
    private MensagemService mensagemService;

    @Test
    void shouldSendMessage() throws Exception {
        MensagensModel mensagem = new MensagensModel();
        mensagem.setId(1);
        mensagem.setAssunto("Pedido");
        mensagem.setDescricao("Preciso de oração");
        mensagem.setStatus(StatusMensage.PENDENTE);
        mensagem.setDataPublicacao(LocalDate.now());

        when(mensagemService.save(any())).thenReturn(mensagem);

        mockMvc.perform(post("/user/mensagem/send")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "descricao": "Preciso de oração",
                                  "assunto": "Pedido"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.assunto").value("Pedido"));
    }

    @Test
    void shouldReturnValidationErrorWhenSubjectMissing() throws Exception {
        mockMvc.perform(post("/user/mensagem/send")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "descricao": "Preciso de oração"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Dados inválidos"));
    }

    @Test
    void shouldListMessages() throws Exception {
        MensagensModel mensagem = new MensagensModel();
        mensagem.setId(1);
        mensagem.setAssunto("Pedido");
        mensagem.setDescricao("Preciso de oração");

        when(mensagemService.AllData()).thenReturn(List.of(mensagem));

        mockMvc.perform(get("/admin/mensagem/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].assunto").value("Pedido"));
    }

    @Test
    void shouldGetSingleMessage() throws Exception {
        MensagensModel mensagem = new MensagensModel();
        mensagem.setId(2);
        mensagem.setAssunto("Feedback");
        mensagem.setDescricao("Gostei muito");

        when(mensagemService.Select(2)).thenReturn(mensagem);

        mockMvc.perform(get("/admin/mensagem/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2));
    }

    @Test
    void shouldIgnoreMessage() throws Exception {
        MensagensModel mensagem = new MensagensModel();
        mensagem.setId(3);
        mensagem.setAssunto("Spam");
        mensagem.setDescricao("Ignorar");

        when(mensagemService.ignorar(3)).thenReturn(mensagem);

        mockMvc.perform(delete("/admin/mensagem/ignorar/3").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3));
    }
}
