package com.igreja.api.components;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.igreja.api.dto.error.ApiErrorResponse;
import com.igreja.api.enums.UserStatus;
import com.igreja.api.models.UserModel;
import com.igreja.api.services.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final UserService userDetailsService;
    private final JwUtil jwtUtil;
    private final ObjectMapper objectMapper;

    public JwtAuthenticationFilter(UserService userDetailsService, JwUtil jwtUtil, ObjectMapper objectMapper) {
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.objectMapper = objectMapper;
    }

    // Rotas que não precisam de autenticação JWT
    private static final String[] PUBLIC_URLS = {
        "/auth/login",
        "/auth/register",
        "/auth/google",
        "/public/inscritos",
        "/public/mensagem",
        "/health",
        "/swagger-ui/",
        "/v3/api-docs/",
        "/test/"
    };
    private static final String[] PUBLIC_GET_PREFIXES = {
        "/user/home",
        "/user/actividade",
        "/user/artigo",
        "/user/midia",
        "/user/vistos",
        "/user/comentario"
    };

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        // Ignorar autenticação JWT para rotas públicas
        if (isPublicPath(request, path)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);

        if (username == null) {
            writeErrorResponse(
                    response,
                    request,
                    HttpStatus.UNAUTHORIZED,
                    "Token inválido",
                    "O token JWT é inválido ou expirou.");
            return;
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserModel userModel;
            try {
                userModel = userDetailsService.loadUserByEmail(username);
            } catch (UsernameNotFoundException ex) {
                writeErrorResponse(
                        response,
                        request,
                        HttpStatus.UNAUTHORIZED,
                        "Não autenticado",
                        "Utilizador não encontrado.");
                return;
            }
            UserDetails userDetails = userDetailsService.buildUserDetails(userModel);

            if (jwtUtil.validateToken(token, userDetails)) {
                if (!userDetailsService.isActiveForAccess(userModel)) {
                    writeErrorResponse(
                            response,
                            request,
                            HttpStatus.FORBIDDEN,
                            "Acesso bloqueado",
                            statusMessage(userModel.getStatus()));
                    return;
                }
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                writeErrorResponse(
                        response,
                        request,
                        HttpStatus.UNAUTHORIZED,
                        "Token inválido",
                        "O token JWT enviado não é válido.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String statusMessage(UserStatus status) {
        if (status == null) {
            return "Conta indisponível. Contacte o administrador.";
        }
        return switch (status) {
            case PENDENTE -> "Conta pendente de aprovação do administrador.";
            case BLOQUEADO -> "Conta bloqueada pelo administrador.";
            case INATIVO -> "Conta inativa. Faça login novamente.";
            case ATIVO -> "Conta ativa.";
        };
    }

    private void writeErrorResponse(
            HttpServletResponse response,
            HttpServletRequest request,
            HttpStatus status,
            String error,
            String message) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        ApiErrorResponse body = new ApiErrorResponse(
                LocalDateTime.now(),
                status.value(),
                error,
                message,
                request.getRequestURI(),
                List.of());

        objectMapper.writeValue(response.getWriter(), body);
    }

    private boolean isPublicPath(HttpServletRequest request, String path) {
        for (String publicPath : PUBLIC_URLS) {
            if (path.startsWith(publicPath)) {
                return true;
            }
        }

        if ("GET".equalsIgnoreCase(request.getMethod())) {
            for (String prefix : PUBLIC_GET_PREFIXES) {
                if (path.startsWith(prefix)) {
                    return true;
                }
            }
        }

        return false;
    }
}
