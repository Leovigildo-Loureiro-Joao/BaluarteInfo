package com.igreja.api.services;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import com.igreja.api.dto.user.GoogleTokenInfo;

@Service
public class GoogleOAuthService {
    private final String clientId;
    private final RestTemplate restTemplate = new RestTemplate();

    public GoogleOAuthService(@Value("${google.oauth.client-id:}") String clientId) {
        this.clientId = clientId;
    }

    public GoogleTokenInfo verify(String credential) {
        if (clientId == null || clientId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Google OAuth não configurado.");
        }

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> payload = restTemplate.getForObject(
                    "https://oauth2.googleapis.com/tokeninfo?id_token={token}",
                    Map.class,
                    credential);

            if (payload == null || payload.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token Google inválido.");
            }

            String aud = String.valueOf(payload.getOrDefault("aud", ""));
            if (!clientId.equals(aud)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token Google inválido.");
            }

            String email = String.valueOf(payload.getOrDefault("email", ""));
            if (email.isBlank()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token Google inválido.");
            }

            String nome = String.valueOf(payload.getOrDefault("name", email));
            String foto = String.valueOf(payload.getOrDefault("picture", ""));
            boolean emailVerificado = Boolean.parseBoolean(String.valueOf(payload.getOrDefault("email_verified", "false")));

            return new GoogleTokenInfo(email, nome, foto, emailVerificado);
        } catch (HttpClientErrorException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token Google inválido.");
        } catch (RestClientException ex) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Não foi possível validar o Google agora.");
        }
    }
}
