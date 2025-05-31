package com.igreja.api.services;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.Getter;
import lombok.Setter;

@Service
public class CloudDinaryService {
    private final Cloudinary cloudinary;
    private final ExecutorService uploadExecutor; // Pool dedicado para uploads

    @Getter
    private String url;

    @Getter @Setter
    private String uniqueName;

    public CloudDinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
        this.uploadExecutor = Executors.newVirtualThreadPerTaskExecutor(); // Pool com 4 threads
    }

    // Gera o nome único de forma mais eficiente (sem dependência do MultipartFile)
    public void generateUniqueName(String originalFilename) {
        this.uniqueName = UUID.randomUUID() + "_" + originalFilename;
    }

    // Upload assíncrono para MultipartFile
    public String uploadFileAsync(MultipartFile file, String resourceType) throws InterruptedException, ExecutionException, TimeoutException {
        return uploadExecutor.submit(() -> {
            try {
                System.out.println(this.uniqueName);
              String encodedPublicId = URLEncoder.encode(this.uniqueName.trim(), StandardCharsets.UTF_8.toString())
                .replace("+", "_");
            
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), 
                ObjectUtils.asMap(
                    "resource_type", resourceType,
                    "folder", "upload",
                    "timeout", 4000,
                    "quality", "auto:fast",
                    "public_id", encodedPublicId,  // Usa o nome normalizado
                    "filename_override", encodedPublicId // Força o nome do arquivo
                ));
                    System.out.println(this.uniqueName); 
                return uploadResult.get("url").toString();
            } catch (IOException e) {
                throw new RuntimeException("Falha no upload do arquivo", e);
            }
        }).get(30, TimeUnit.SECONDS); // ✅ Tempo aumentado
    }


    public String uploadFileAsync(byte[] file, String resourceType) throws InterruptedException, ExecutionException, TimeoutException {
        return uploadExecutor.submit(() -> {
            try {
                System.out.println(this.uniqueName);
              String encodedPublicId = URLEncoder.encode(this.uniqueName.trim(), StandardCharsets.UTF_8.toString())
                .replace("+", "_");
            
            Map uploadResult = cloudinary.uploader().upload(file, 
                ObjectUtils.asMap(
                    "resource_type", resourceType,
                    "folder", "upload",
                    "timeout", 4000,
                    "quality", "auto:fast",
                    "public_id", encodedPublicId  // Usa o nome normalizado
                ));
                    System.out.println(this.uniqueName); 
                return uploadResult.get("url").toString();
            } catch (IOException e) {
                throw new RuntimeException("Falha no upload do arquivo", e);
            }
        }).get(30, TimeUnit.SECONDS); // ✅ Tempo aumentado
    }

    // Upload assíncrono para BufferedImage
    public String uploadImageAsync(BufferedImage image, String resourceType) throws InterruptedException, ExecutionException, TimeoutException {
        return uploadExecutor.submit(() -> {
          
            try {
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(image, "JPEG", baos);
                byte[] imageBytes = baos.toByteArray();
                Map uploadResult = cloudinary.uploader().upload(imageBytes, 
                    ObjectUtils.asMap(
                        "resource_type", resourceType,
                        "folder", "upload",
                         "timeout", 4000,
                        "quality", "auto:fast",
                        "public_id", this.uniqueName.replace(".pdf", "").trim()
                    ));
                return uploadResult.get("url").toString();
            } catch (IOException e) {
                throw new RuntimeException("Falha no upload da imagem", e);
            }
        }).get(30, TimeUnit.SECONDS); // ✅ Tempo aumentado
    }
   
    // Exclusão assíncrona
    public CompletableFuture<Boolean> deleteFileAsync(String url) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String publicId = extractPublicId(url);
                Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                return "ok".equals(result.get("result"));
            } catch (Exception e) {
                throw new RuntimeException("Falha ao excluir arquivo", e);
            }
        }, uploadExecutor);
    }

    // Extração segura do public_id
    private String extractPublicId(String url) {

        int uploadIndex = url.indexOf("upload/");
        if (uploadIndex == -1) {
            throw new IllegalArgumentException("URL do Cloudinary inválida");
        }
        String urlS =url.split("/")[url.split("/").length-1];
        
        return"upload/"+urlS.substring(0, urlS.lastIndexOf(".")); // Extrai o public_id corretamente
    }
}