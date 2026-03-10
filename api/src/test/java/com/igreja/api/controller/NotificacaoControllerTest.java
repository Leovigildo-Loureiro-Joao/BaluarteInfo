package com.igreja.api.controller;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;

import com.igreja.api.controllers.NotificacaoController;
import com.igreja.api.enums.NotificacaoType;
import com.igreja.api.exceptions.GlobalExceptionHandler;
import com.igreja.api.models.NotificacaoModel;
import com.igreja.api.services.NotificacaoService;

@WebMvcTest(NotificacaoController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
@ContextConfiguration(classes = {NotificacaoController.class, GlobalExceptionHandler.class})
class NotificacaoControllerTest {

    @Autowired
    private org.springframework.test.web.servlet.MockMvc mockMvc;

    @MockBean
    private NotificacaoService notificacaoService;

    @Test
    void shouldListUnreadNotifications() throws Exception {
        NotificacaoModel notificacao = buildNotification(1, "Lembrete da actividade", false, NotificacaoType.LEMBRETE);

        when(notificacaoService.unread()).thenReturn(List.of(notificacao));

        mockMvc.perform(get("/admin/notificacao"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].lido").value(false))
                .andExpect(jsonPath("$[0].type").value("LEMBRETE"));
    }

    @Test
    void shouldListAllNotifications() throws Exception {
        NotificacaoModel notificacao = buildNotification(2, "Galeria pendente", true, NotificacaoType.GALERIA);

        when(notificacaoService.all()).thenReturn(List.of(notificacao));

        mockMvc.perform(get("/admin/notificacao/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(2))
                .andExpect(jsonPath("$[0].lido").value(true))
                .andExpect(jsonPath("$[0].type").value("GALERIA"));
    }

    @Test
    void shouldDeleteReadNotificationsAndReturnSummary() throws Exception {
        when(notificacaoService.deleteRead()).thenReturn(3);

        mockMvc.perform(delete("/admin/notificacao").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Notificações lidas removidas com sucesso."))
                .andExpect(jsonPath("$.deleted").value(3));
    }

    @Test
    void shouldMarkNotificationAsRead() throws Exception {
        NotificacaoModel notificacao = buildNotification(5, "Limite de inscritos", true, NotificacaoType.LIMITE_INSCRITOS);

        when(notificacaoService.markAsRead(5)).thenReturn(notificacao);

        mockMvc.perform(put("/admin/notificacao/5/ler").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5))
                .andExpect(jsonPath("$.lido").value(true))
                .andExpect(jsonPath("$.type").value("LIMITE_INSCRITOS"));
    }

    @Test
    void shouldReturnFriendlyErrorWhenNotificationDoesNotExist() throws Exception {
        when(notificacaoService.markAsRead(99))
                .thenThrow(new NoSuchElementException("Notificação inexistente."));

        mockMvc.perform(put("/admin/notificacao/99/ler").with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Requisição inválida"))
                .andExpect(jsonPath("$.message").value("Notificação inexistente."));
    }

    private NotificacaoModel buildNotification(int id, String descricao, boolean lido, NotificacaoType type) {
        NotificacaoModel notificacao = new NotificacaoModel();
        notificacao.setId(id);
        notificacao.setAssunto("Assunto");
        notificacao.setDescricao(descricao);
        notificacao.setLido(lido);
        notificacao.setType(type);
        notificacao.setDataNotificacao(LocalDateTime.now());
        return notificacao;
    }
}
