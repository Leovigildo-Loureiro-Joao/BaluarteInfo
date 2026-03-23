package com.igreja.api.services;

import java.time.Duration;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.igreja.api.utils.ArtigoProcessor;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class GeminiService {
    private final String apiKey;
    private final String model;
    private final String baseUrl;
    private final String apiVersion;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    @Autowired
    private ArtigoProcessor artigoProcessor;

    public GeminiService(
            @Value("${gemini.api.key:${GEMINI_API_KEY:${GEMENI_API_KEY:}}}") String apiKey,
            @Value("${gemini.model:${GEMINI_MODEL:gemini-2.5-flash}}") String model,
            @Value("${gemini.api.base-url:${GEMINI_API_BASE_URL:https://generativelanguage.googleapis.com}}") String baseUrl,
            @Value("${gemini.api.version:${GEMINI_API_VERSION:v1beta}}") String apiVersion,
            ObjectMapper objectMapper) {
        this.apiKey = apiKey == null ? "" : apiKey.trim();
        this.model = normalizeModelName(model);
        this.baseUrl = normalizeBaseUrl(baseUrl);
        this.apiVersion = normalizeApiVersion(apiVersion);
        this.objectMapper = objectMapper;

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout((int) Duration.ofSeconds(10).toMillis());
        factory.setReadTimeout((int) Duration.ofSeconds(120).toMillis()); // 2 minutos para processamento
        this.restTemplate = new RestTemplate(factory);
    }

    public String generateHtmlFromPdf(String titulo, String descricao, String extractedText) {
        if (apiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "GEMINI_API_KEY não configurada.");
        }

        String safeTitulo = titulo == null ? "" : titulo.trim();
        String safeDescricao = descricao == null ? "" : descricao.trim();
        String safeText = extractedText == null ? "" : extractedText.trim();

        // Limita o tamanho do texto para evitar tokens excessivos
        if (safeText.length() > 150000) {
            safeText = safeText.substring(0, 150000);
            log.info("Texto truncado para 60000 caracteres");
        }

        // Prompt mais simples - pede apenas texto estruturado
        String prompt = """
            Você é um assistente especializado em organizar conteúdo para artigos religiosos.
            
            Por favor, estruture o texto abaixo seguindo estas regras:
            
	            1. Mantenha APENAS o conteúdo original - NÃO invente fatos, versículos ou citações
	            2. Use # para títulos principais e nao juntes tema com titulos do artigo (como "Capítulo 1:")
	            3. Use ## para subtítulos
	            4. Coloque títulos/subtítulos sempre em uma linha isolada e deixe uma linha em branco depois
	            5. Separe os parágrafos com uma linha em branco
	            6. Quando encontrar um versículo bíblico, coloque-o entre [VERSICULO] e [/VERSICULO]
	            7. Quando encontrar uma lista, coloque cada item começando com • (bullet point)
	            8. Mantenha a ordem lógica do texto original
	            9. NÃO adicione HTML, NÃO adicione markdown complexo, apenas texto simples com a formatação indicada
            
            Título do artigo: %s
            Descrição: %s
            
            Texto para organizar:
            %s
            
            Responda APENAS com o texto formatado, sem explicações adicionais.
            """.formatted(safeTitulo, safeDescricao, safeText);

        try {
            log.info("Enviando prompt para Gemini (modelo: {}, título: {})", model, safeTitulo);
            String response = callGemini(prompt);
            log.info("Resposta recebida do Gemini (tamanho: {} caracteres)", response.length());

            // Se o Gemini devolver algo muito curto para um texto grande, é provável que tenha truncado/colapsado demais.
            // Neste caso, cai para o processador local para preservar mais conteúdo.
            if (safeText.length() > 6000 && (response == null || response.trim().length() < 1500)) {
                log.warn("Resposta do Gemini curta demais para o input (inputLen={}, outputLen={}). Usando fallback local.",
                        safeText.length(), response == null ? 0 : response.trim().length());
                return artigoProcessor.processToHtml(safeTitulo, safeDescricao, safeText);
            }
            
            // Processa a resposta para HTML bonito
            String processedHtml = artigoProcessor.processToHtml(safeTitulo, safeDescricao, response);
            
            return processedHtml;
            
        } catch (ResponseStatusException e) {
            log.error("Erro na chamada do Gemini: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Erro inesperado ao processar com Gemini: {}", e.getMessage(), e);
            
            // Fallback: processa o texto extraído diretamente
            log.info("Usando fallback com texto extraído do PDF");
            return artigoProcessor.processToHtml(safeTitulo, safeDescricao, safeText);
        }
    }

    /**
     * Método que realmente chama a API do Gemini
     */
    private String callGemini(String prompt) {
        return callGeminiWithFallback(prompt, apiVersion, true);
    }

    private String callGeminiWithFallback(String prompt, String versionToUse, boolean allowFallbackVersion) {
        String url = "%s/%s/models/%s:generateContent?key=%s".formatted(baseUrl, versionToUse, model, apiKey);
        // Constrói o corpo da requisição conforme documentação da Gemini API
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of(
                    "parts", List.of(
                        Map.of("text", prompt)
                    )
                )
            ),
            "generationConfig", Map.of(
                "temperature", 0.3,  // Baixa temperatura para mais consistência
                "topK", 40,
                "topP", 0.95,
                "maxOutputTokens", 8192,  // Respostas mais longas (útil para artigos maiores)
                "stopSequences", List.of()
            )
        );

        try {
            // Evita expor a API key em logs.
            log.debug("Chamando Gemini API (version={}, model={})", versionToUse, model);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(url, requestBody, Map.class);
            
            if (response == null) {
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Gemini não respondeu.");
            }

            // Extrai o texto da resposta conforme estrutura da Gemini API
            return extractTextFromResponse(response);
            
        } catch (HttpStatusCodeException e) {
            GeminiApiError apiError = parseGeminiError(e.getResponseBodyAsString());
            String message = apiError != null && apiError.message != null ? apiError.message : e.getMessage();
            String status = apiError != null && apiError.status != null ? apiError.status : null;

            if (allowFallbackVersion && shouldRetryWithOtherVersion(e.getStatusCode().value(), status, message)) {
                String fallbackVersion = "v1beta".equalsIgnoreCase(versionToUse) ? "v1" : "v1beta";
                log.warn("Gemini NOT_FOUND para model={} em {}. Tentando novamente em {}.", model, versionToUse, fallbackVersion);
                return callGeminiWithFallback(prompt, fallbackVersion, false);
            }

            String safeBody = safeTrim(e.getResponseBodyAsString(), 1200);
            log.error("Gemini retornou {} (version={}, model={}): {}", e.getStatusCode(), versionToUse, model, safeBody);
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Gemini falhou (version=" + versionToUse + ", model=" + model + "): "
                            + (message == null || message.isBlank() ? safeBody : message)
                            + ". Dica: ajuste gemini.api.version (v1/v1beta) e gemini.model (ou defina GEMINI_API_VERSION/GEMINI_MODEL).");
        } catch (RestClientException e) {
            log.error("Erro na comunicação com Gemini: {}", e.getMessage());
            throw new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE, 
                "Falha ao chamar Gemini agora: " + e.getMessage()
            );
        }
    }

    private static boolean shouldRetryWithOtherVersion(int httpStatusCode, String apiStatus, String apiMessage) {
        if (httpStatusCode != 404) {
            return false;
        }
        if (apiMessage == null) {
            return false;
        }
        String msg = apiMessage.toLowerCase();
        boolean looksLikeModelNotFound = (apiStatus != null && "not_found".equalsIgnoreCase(apiStatus))
                || msg.contains("not found")
                || msg.contains("listmodels")
                || msg.contains("api version")
                || msg.contains("not supported for generatecontent");
        return looksLikeModelNotFound;
    }

    private static String normalizeModelName(String model) {
        String m = model == null ? "" : model.trim();
        if (m.isBlank()) {
            return "gemini-1.5-flash";
        }
        if (m.startsWith("models/")) {
            return m.substring("models/".length()).trim();
        }
        return m;
    }

    private static String normalizeBaseUrl(String baseUrl) {
        String b = baseUrl == null ? "" : baseUrl.trim();
        if (b.isBlank()) {
            return "https://generativelanguage.googleapis.com";
        }
        while (b.endsWith("/")) {
            b = b.substring(0, b.length() - 1);
        }
        return b;
    }

    private static String normalizeApiVersion(String apiVersion) {
        String v = apiVersion == null ? "" : apiVersion.trim();
        if (v.isBlank()) {
            return "v1beta";
        }
        while (v.startsWith("/")) {
            v = v.substring(1);
        }
        while (v.endsWith("/")) {
            v = v.substring(0, v.length() - 1);
        }
        return v;
    }

    private static String safeTrim(String s, int max) {
        if (s == null) {
            return "";
        }
        String t = s.trim();
        if (t.length() <= max) {
            return t;
        }
        return t.substring(0, max) + "...";
    }

    private record GeminiApiError(String status, String message) {}

    @SuppressWarnings("unchecked")
    private GeminiApiError parseGeminiError(String responseBody) {
        if (responseBody == null || responseBody.isBlank()) {
            return null;
        }
        try {
            Map<String, Object> top = objectMapper.readValue(responseBody, Map.class);
            Object errObj = top.get("error");
            if (!(errObj instanceof Map<?, ?> err)) {
                return null;
            }
            String status = err.get("status") == null ? null : err.get("status").toString();
            String message = err.get("message") == null ? null : err.get("message").toString();
            return new GeminiApiError(status, message);
        } catch (Exception ignore) {
            return null;
        }
    }

    /**
     * Extrai o texto da resposta da Gemini API
     */
    @SuppressWarnings("unchecked")
    private String extractTextFromResponse(Map<String, Object> response) {
        try {
            // Verifica se há candidates
            Object candidatesObj = response.get("candidates");
            if (!(candidatesObj instanceof List<?> candidates) || candidates.isEmpty()) {
                // Verifica se há erro
                Object errorObj = response.get("error");
                if (errorObj != null) {
                    String errorJson = objectMapper.writeValueAsString(errorObj);
                    Map<String, Object> error = objectMapper.readValue(errorJson, Map.class);
                    String errorMessage = (String) error.get("message");
                    throw new ResponseStatusException(
                        HttpStatus.SERVICE_UNAVAILABLE, 
                        "Erro da Gemini API: " + errorMessage
                    );
                }
                throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE, 
                    "Resposta do Gemini sem candidates."
                );
            }

            // Pega o primeiro candidate
            Object firstCandidate = candidates.get(0);
            String candidateJson = objectMapper.writeValueAsString(firstCandidate);
            Map<String, Object> candidate = objectMapper.readValue(candidateJson, Map.class);

            // Extrai o content
            Object contentObj = candidate.get("content");
            if (!(contentObj instanceof Map<?, ?> content)) {
                throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE, 
                    "Resposta do Gemini sem content."
                );
            }

            // Extrai os parts
            Object partsObj = content.get("parts");
            if (!(partsObj instanceof List<?> parts) || parts.isEmpty()) {
                throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE, 
                    "Resposta do Gemini sem parts."
                );
            }

            // Pega o primeiro part
            Object firstPart = parts.get(0);
            String partJson = objectMapper.writeValueAsString(firstPart);
            Map<String, Object> part = objectMapper.readValue(partJson, Map.class);

            // Extrai o texto
            Object textObj = part.get("text");
            if (textObj == null) {
                // Verifica se foi bloqueado por segurança
                Object safetyRatings = candidate.get("safetyRatings");
                if (safetyRatings != null) {
                    log.warn("Resposta bloqueada por segurança: {}", safetyRatings);
                    throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, 
                        "Conteúdo bloqueado pelas regras de segurança da Gemini."
                    );
                }
                return "";
            }

            return textObj.toString().trim();
            
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Erro ao processar resposta do Gemini: {}", e.getMessage(), e);
            throw new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE, 
                "Falha ao processar resposta do Gemini: " + e.getMessage()
            );
        }
    }

    /**
     * Método original para compatibilidade (se ainda for usado em outros lugares)
     */
    public String rewriteToMarkdown(String titulo, String descricao, String plainText) {
        return rewriteToMarkdown(titulo, descricao, plainText, null);
    }

    public String rewriteToMarkdown(String titulo, String descricao, String plainText, String instruction) {
        String safeTitulo = titulo == null ? "" : titulo.trim();
        String safeDescricao = descricao == null ? "" : descricao.trim();
        String safeText = plainText == null ? "" : plainText.trim();
        String safeInstruction = instruction == null ? "" : instruction.trim();

        if (safeText.length() > 45000) {
            safeText = safeText.substring(0, 45000);
        }

        String instructionBlock = safeInstruction.isBlank()
                ? ""
                : """

                Instruções do administrador (siga apenas se for compatível com o texto, sem inventar fatos):
                %s
                """.formatted(safeInstruction);

        String prompt = """
                Reescreva o conteúdo abaixo em português de forma mais elegante, clara e bem estruturada.
                Regras:
                - Não invente fatos
                - Preserve nomes próprios, datas e referências bíblicas
                - Use markdown simples com # para títulos
                - Separe parágrafos com linha em branco

                Título: %s
                Descrição: %s
                %s

                Texto:
                %s
                """.formatted(safeTitulo, safeDescricao, instructionBlock, safeText);

        return callGemini(prompt);
    }
}
