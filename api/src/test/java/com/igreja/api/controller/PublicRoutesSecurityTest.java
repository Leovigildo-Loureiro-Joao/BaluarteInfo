package com.igreja.api.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;

import com.igreja.api.components.JwtAuthenticationFilter;
import com.igreja.api.components.RestAccessDeniedHandler;
import com.igreja.api.components.RestAuthenticationEntryPoint;
import com.igreja.api.configuration.SecurityConfig;
import com.igreja.api.controllers.ActividadeController;
import com.igreja.api.controllers.InscritosController;
import com.igreja.api.dto.PageResponse;
import com.igreja.api.exceptions.GlobalExceptionHandler;
import com.igreja.api.repositories.UserRepository;
import com.igreja.api.services.ActividadeService;
import com.igreja.api.services.InscritosService;
import com.igreja.api.services.UserService;
import com.igreja.api.components.JwUtil;

@WebMvcTest({ActividadeController.class, InscritosController.class})
@AutoConfigureMockMvc
@Import({
        SecurityConfig.class,
        JwtAuthenticationFilter.class,
        RestAuthenticationEntryPoint.class,
        RestAccessDeniedHandler.class,
        GlobalExceptionHandler.class
})
@ContextConfiguration(classes = {
        ActividadeController.class,
        InscritosController.class,
        SecurityConfig.class,
        JwtAuthenticationFilter.class,
        RestAuthenticationEntryPoint.class,
        RestAccessDeniedHandler.class,
        GlobalExceptionHandler.class
})
class PublicRoutesSecurityTest {

    @Autowired
    private org.springframework.test.web.servlet.MockMvc mockMvc;

    @MockBean
    private ActividadeService actividadeService;

    @MockBean
    private InscritosService inscritosService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private UserService userService;

    @MockBean
    private JwUtil jwtUtil;

    @Test
    void shouldAllowPublicInscritosListing() throws Exception {
        when(actividadeService.InscritosAll(1, 0, 10))
                .thenReturn(new PageResponse<>(List.of(), 0, 10, 0, 0));

        mockMvc.perform(get("/user/actividade/1/inscritos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void shouldDenyInscricaoWithoutToken() throws Exception {
        mockMvc.perform(post("/user/inscritos/1"))
                .andExpect(status().isUnauthorized());
    }
}
