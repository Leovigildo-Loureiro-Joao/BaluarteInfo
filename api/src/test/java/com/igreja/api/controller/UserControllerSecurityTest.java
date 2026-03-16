package com.igreja.api.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;

import com.igreja.api.components.JwUtil;
import com.igreja.api.components.JwtAuthenticationFilter;
import com.igreja.api.components.RestAccessDeniedHandler;
import com.igreja.api.components.RestAuthenticationEntryPoint;
import com.igreja.api.controllers.UserController;
import com.igreja.api.dto.user.UserDtoData;
import com.igreja.api.enums.UserStatus;
import com.igreja.api.exceptions.GlobalExceptionHandler;
import com.igreja.api.services.AdminAuditLogService;
import com.igreja.api.services.ComentarioService;
import com.igreja.api.services.GoogleOAuthService;
import com.igreja.api.services.InscritosService;
import com.igreja.api.services.MensagemService;
import com.igreja.api.services.UserService;
import com.igreja.api.services.UserDownloadService;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc
@Import({
        JwtAuthenticationFilter.class,
        RestAuthenticationEntryPoint.class,
        RestAccessDeniedHandler.class,
        GlobalExceptionHandler.class,
        UserControllerSecurityTest.TestSecurityConfig.class
})
@ContextConfiguration(classes = {
        UserController.class,
        JwtAuthenticationFilter.class,
        RestAuthenticationEntryPoint.class,
        RestAccessDeniedHandler.class,
        GlobalExceptionHandler.class,
        UserControllerSecurityTest.TestSecurityConfig.class
})
class UserControllerSecurityTest {

    @Autowired
    private org.springframework.test.web.servlet.MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private JwUtil jwtUtil;

    @MockBean
    private AdminAuditLogService adminAuditLogService;

    @MockBean
    private MensagemService mensagemService;

    @MockBean
    private ComentarioService comentarioService;

    @MockBean
    private InscritosService inscritosService;

    @MockBean
    private UserDownloadService userDownloadService;

    @MockBean
    private GoogleOAuthService googleOAuthService;

    @Test
    void shouldLoginSuccessfully() throws Exception {
        UserDetails principal = User.withUsername("admin@igreja.com")
                .password("encoded")
                .roles("ADMIN")
                .build();
        com.igreja.api.models.UserModel userModel = new com.igreja.api.models.UserModel();
        userModel.setEmail("admin@igreja.com");
        userModel.setStatus(UserStatus.ATIVO);

        when(authenticationManager.authenticate(any()))
                .thenReturn(new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        principal.getAuthorities()));
        when(jwtUtil.generateToken(principal)).thenReturn("jwt-token");
        when(userService.loadUserByEmail("admin@igreja.com")).thenReturn(userModel);
        when(userService.markLogin(userModel))
                .thenReturn(buildUser(1L, "Admin", "admin@igreja.com", "ADMIN"));

        mockMvc.perform(post("/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "admin@igreja.com",
                                  "password": "123456"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.user.email").value("admin@igreja.com"))
                .andExpect(jsonPath("$.user.roles").value("ADMIN"));
    }

    @Test
    void shouldReturnUnauthorizedWhenLoginFails() throws Exception {
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        mockMvc.perform(post("/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "admin@igreja.com",
                                  "password": "errada"
                                }
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Não autenticado"))
                .andExpect(jsonPath("$.message").value("Email ou palavra-passe inválidos."));
    }

    @Test
    void shouldDenyAccessWithoutToken() throws Exception {
        mockMvc.perform(get("/user/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Não autenticado"))
                .andExpect(jsonPath("$.message").value("Autenticação necessária ou token inválido."));
    }

    @Test
    void shouldReturnCurrentUserWhenTokenIsValid() throws Exception {
        UserDetails principal = User.withUsername("membro@igreja.com")
                .password("encoded")
                .roles("USER")
                .build();
        com.igreja.api.models.UserModel userModel = new com.igreja.api.models.UserModel();
        userModel.setEmail("membro@igreja.com");
        userModel.setStatus(UserStatus.ATIVO);

        when(jwtUtil.extractUsername("valid-user-token")).thenReturn("membro@igreja.com");
        when(userService.loadUserByEmail("membro@igreja.com")).thenReturn(userModel);
        when(userService.buildUserDetails(userModel)).thenReturn(principal);
        when(userService.isActiveForAccess(userModel)).thenReturn(true);
        when(jwtUtil.validateToken("valid-user-token", principal)).thenReturn(true);
        when(userService.findByIdData("membro@igreja.com"))
                .thenReturn(buildUser(2L, "Membro", "membro@igreja.com", "USER"));

        mockMvc.perform(get("/user/me")
                        .header("Authorization", "Bearer valid-user-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("membro@igreja.com"))
                .andExpect(jsonPath("$.roles").value("USER"));
    }

    @Test
    void shouldReturnForbiddenForUserAccessingAdminEndpoint() throws Exception {
        UserDetails principal = User.withUsername("membro@igreja.com")
                .password("encoded")
                .roles("USER")
                .build();
        com.igreja.api.models.UserModel userModel = new com.igreja.api.models.UserModel();
        userModel.setEmail("membro@igreja.com");
        userModel.setStatus(UserStatus.ATIVO);

        when(jwtUtil.extractUsername("valid-user-token")).thenReturn("membro@igreja.com");
        when(userService.loadUserByEmail("membro@igreja.com")).thenReturn(userModel);
        when(userService.buildUserDetails(userModel)).thenReturn(principal);
        when(userService.isActiveForAccess(userModel)).thenReturn(true);
        when(jwtUtil.validateToken("valid-user-token", principal)).thenReturn(true);

        mockMvc.perform(get("/admin/user")
                        .header("Authorization", "Bearer valid-user-token"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value("Acesso negado"))
                .andExpect(jsonPath("$.message").value("Você não tem permissão para aceder a este recurso."));
    }

    @Test
    void shouldDenyAvatarUploadWithoutToken() throws Exception {
        MockMultipartFile avatar = new MockMultipartFile("img", "avatar.jpg", MediaType.IMAGE_JPEG_VALUE, "img".getBytes());

        mockMvc.perform(multipart(HttpMethod.PUT, "/user/me/avatar")
                        .file(avatar))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Não autenticado"));
    }

    @Test
    void shouldAllowAvatarUploadWithValidToken() throws Exception {
        UserDetails principal = User.withUsername("membro@igreja.com")
                .password("encoded")
                .roles("USER")
                .build();
        com.igreja.api.models.UserModel userModel = new com.igreja.api.models.UserModel();
        userModel.setEmail("membro@igreja.com");
        userModel.setStatus(UserStatus.ATIVO);

        when(jwtUtil.extractUsername("valid-user-token")).thenReturn("membro@igreja.com");
        when(userService.loadUserByEmail("membro@igreja.com")).thenReturn(userModel);
        when(userService.buildUserDetails(userModel)).thenReturn(principal);
        when(userService.isActiveForAccess(userModel)).thenReturn(true);
        when(jwtUtil.validateToken("valid-user-token", principal)).thenReturn(true);
        when(userService.updateAvatar(any(), any()))
                .thenReturn(buildUser(2L, "Membro", "membro@igreja.com", "USER"));

        MockMultipartFile avatar = new MockMultipartFile("img", "avatar.jpg", MediaType.IMAGE_JPEG_VALUE, "img".getBytes());

        mockMvc.perform(multipart(HttpMethod.PUT, "/user/me/avatar")
                        .file(avatar)
                        .header("Authorization", "Bearer valid-user-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("membro@igreja.com"))
                .andExpect(jsonPath("$.roles").value("USER"));
    }

    @EnableWebSecurity
    static class TestSecurityConfig {

        @Bean
        SecurityFilterChain securityFilterChain(
                HttpSecurity http,
                JwtAuthenticationFilter jwtAuthenticationFilter,
                RestAuthenticationEntryPoint authenticationEntryPoint,
                RestAccessDeniedHandler accessDeniedHandler) throws Exception {
            http
                    .csrf(csrf -> csrf.disable())
                    .exceptionHandling(exception -> exception
                            .authenticationEntryPoint(authenticationEntryPoint)
                            .accessDeniedHandler(accessDeniedHandler))
                    .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    .authorizeHttpRequests(auth -> auth
                            .requestMatchers("/admin/**").hasRole("ADMIN")
                            .requestMatchers("/auth/login", "/auth/register", "/health", "/swagger-ui/**", "/v3/api-docs/**")
                            .permitAll()
                            .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
                            .anyRequest().authenticated())
                    .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

            return http.build();
        }

        @Bean
        PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }
    }

    private UserDtoData buildUser(long id, String nome, String email, String roles) {
        return new UserDtoData(
                id,
                nome,
                email,
                "https://img",
                roles,
                UserStatus.ATIVO,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null);
    }
}
