package com.example.services;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.net.http.HttpRequest.BodyPublisher;
import java.net.http.HttpRequest.BodyPublishers;
import java.util.Map;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import com.example.utils.FilePartUtil;
import com.example.utils.TokenSeccao;
import com.fasterxml.jackson.databind.ObjectMapper;


public class ApiService {
    private static final String BASE_URL = "http://localhost:8080"; // Ou o IP público
    private static final String boundary = "----JavaBoundary" + System.currentTimeMillis();
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

    public static String postForm(String endpoint, Map<String, String> params,List<FilePartUtil> files) throws IOException, InterruptedException {
         // Constrói o corpo do formulário multipart
        BodyPublisher body = buildFormData(params, files);
         HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + endpoint))
            .header("Content-Type", "multipart/form-data; boundary=" + boundary)
            .header("Authorization", "Bearer " + TokenSeccao.getToken())
            .POST(body)
            .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
         System.out.println(response);
        return response.body();
    }

    public static String putForm(String endpoint, Map<String, String> params,List<FilePartUtil> files) throws IOException, InterruptedException {
       BodyPublisher body = buildFormData(params, files);
         HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + endpoint))
            .header("Content-Type", "multipart/form-data; boundary=" + boundary)
            .header("Authorization", "Bearer " + TokenSeccao.getToken())
            .PUT(body)
            .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println("Response from postMultipart: " + response.body());
        return response.body();
    }

    public static BodyPublisher buildFormData(Map<String, String> params,List<FilePartUtil> files) throws IOException {
        String LINE_FEED = "\r\n";
        StringBuilder sb = new StringBuilder();

        // Adiciona campos do formulário
        for (Map.Entry<String, String> entry : params.entrySet()) {
            sb.append("--").append(boundary).append(LINE_FEED);
            sb.append("Content-Disposition: form-data; name=\"").append(entry.getKey()).append("\"").append(LINE_FEED);
            sb.append(LINE_FEED);
            sb.append(entry.getValue()).append(LINE_FEED);
        }

        // Adiciona arquivos
        List<byte[]> byteArrays = new ArrayList<>();
        byteArrays.add(sb.toString().getBytes(StandardCharsets.UTF_8));

        for (FilePartUtil file : files) {
            StringBuilder fileSb = new StringBuilder();
            fileSb.append("--").append(boundary).append(LINE_FEED);
            fileSb.append("Content-Disposition: form-data; name=\"").append(file.fieldName)
                  .append("\"; filename=\"").append(file.filePath.getFileName()).append("\"").append(LINE_FEED);
            fileSb.append("Content-Type: ").append(file.mimeType).append(LINE_FEED);
            fileSb.append(LINE_FEED);

            byteArrays.add(fileSb.toString().getBytes(StandardCharsets.UTF_8));
            byteArrays.add(java.nio.file.Files.readAllBytes(file.filePath));
            byteArrays.add(LINE_FEED.getBytes(StandardCharsets.UTF_8));
        }

        byteArrays.add(("--" + boundary + "--" + LINE_FEED).getBytes(StandardCharsets.UTF_8));

        return BodyPublishers.ofByteArrays(byteArrays);
    }

}
