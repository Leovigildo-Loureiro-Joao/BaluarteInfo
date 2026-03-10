package com.igreja.api.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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
import org.springframework.test.context.ContextConfiguration;

import com.igreja.api.controllers.ConfigController;
import com.igreja.api.dto.config.ConfiguracaoDto;
import com.igreja.api.enums.ConfigType;
import com.igreja.api.exceptions.GlobalExceptionHandler;
import com.igreja.api.models.ConfiguracaoModel;
import com.igreja.api.services.ConfigService;

@WebMvcTest(ConfigController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
@ContextConfiguration(classes = {ConfigController.class, GlobalExceptionHandler.class})
class ConfigControllerTest {

    @Autowired
    private org.springframework.test.web.servlet.MockMvc mockMvc;

    @MockBean
    private ConfigService configService;

    @Test
    void shouldEditConfig() throws Exception {
        ConfiguracaoModel config = new ConfiguracaoModel();
        config.setId(1);
        config.setType(ConfigType.ActividadeLimite);
        config.setValue(20);
        config.setEditado(LocalDateTime.now());

        when(configService.edit(any(ConfiguracaoDto.class))).thenReturn(config);

        mockMvc.perform(put("/admin/config/edit")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "value": 20,
                                  "type": "ActividadeLimite"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type").value("ActividadeLimite"))
                .andExpect(jsonPath("$.value").value(20.0));
    }

    @Test
    void shouldListConfigs() throws Exception {
        when(configService.AllConfiguration()).thenReturn(List.of(
                new ConfiguracaoDto(10, ConfigType.ActividadeLimite)));

        mockMvc.perform(get("/admin/config/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].type").value("ActividadeLimite"))
                .andExpect(jsonPath("$[0].value").value(10.0));
    }
}
