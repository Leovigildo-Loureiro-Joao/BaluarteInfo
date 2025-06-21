package com.example.services;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import com.example.utils.TokenSeccao;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

public class ApiService {
    private static final String BASE_URL = "http://localhost:8080"; // Ou o IP público

    public static String post(String endpoint, Map<String, String> params) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        String token = TokenSeccao.getToken(); // Obtém o token da sessão
         // Converte Map para JSON
        String jsonBody = new ObjectMapper().writeValueAsString(params); // Usa Jackson

       
        HttpRequest.Builder builder = HttpRequest.newBuilder()
        .uri(URI.create(BASE_URL + endpoint))
        .header("Content-Type", "application/json");

        if (token != null) {
            builder.header("Authorization","Bearer "+ token);
        }

        HttpRequest request = builder
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }

    public static String put(String endpoint, Map<String, String> params) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        String token = TokenSeccao.getToken(); // Obtém o token da sessão
         // Converte Map para JSON
        String jsonBody = new ObjectMapper().writeValueAsString(params); // Usa Jackson

     
        HttpRequest.Builder builder = HttpRequest.newBuilder()
        .uri(URI.create(BASE_URL + endpoint))
        .header("Content-Type", "application/json");

        if (token != null) {
            builder.header("Authorization", "Bearer "+token);
        }

        HttpRequest request = builder
            .PUT(HttpRequest.BodyPublishers.ofString(jsonBody))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }

    public static String put(String endpoint) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        String token = TokenSeccao.getToken(); // Obtém o token da sessão
        HttpRequest.Builder builder = HttpRequest.newBuilder()
        .uri(URI.create(BASE_URL + endpoint))
        .header("Content-Type", "application/json");

        if (token != null) {
            builder.header("Authorization","Bearer "+ token);
        }

        HttpRequest request = builder
            .PUT(HttpRequest.BodyPublishers.noBody())
            .build();
    
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }

    public static String get(String endpoint) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + endpoint))
            .header("Content-Type", "application/json")
            .header("Authorization","Bearer "+ TokenSeccao.getToken())
            .GET()
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }

    public static String delete(String endpoint) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + endpoint))
            .header("Content-Type", "application/json")
            .header("Authorization","Bearer "+ TokenSeccao.getToken())
            .DELETE()
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }

    private static String buildFormData(Map<String, String> params) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (sb.length() > 0) sb.append("&");
            sb.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8));
            sb.append("=");
            sb.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8));
        }
        return sb.toString();
    }
}
