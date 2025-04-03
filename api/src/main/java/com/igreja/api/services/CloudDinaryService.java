package com.igreja.api.services;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.Getter;

@Service

public class CloudDinaryService {
    @Autowired
    private Cloudinary cloudinary;
    @Getter
    private String url;
    @Getter
    private String uniqueName;

    public void GerarName(MultipartFile file){
        UUID uuid = UUID.randomUUID(); // Gera um UUID único para o arquivo
        uniqueName = uuid.toString() + "_" + file.getOriginalFilename(); 
    }

    public void uploadFile(MultipartFile file,String resourceType) throws IOException {
      // Adiciona o UUID ao nome do arquivo
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
            "resource_type", resourceType,
            "folder", "upload",
            "public_id", uniqueName
        ));
        url= uploadResult.get("url").toString(); // Retorna a URL do arquivo
    }

    public void uploadFile(File file,String resourceType) throws IOException {
        // Adiciona o UUID ao nome do arquivo
          Map uploadResult = cloudinary.uploader().upload(file, ObjectUtils.asMap(
              "resource_type", resourceType,
              "folder", "upload",
              "public_id", uniqueName
          ));
          url= uploadResult.get("url").toString(); // Retorna a URL do arquivo
      }

    public boolean deleteFile(String url) throws IOException {
        try {
            Map result = cloudinary.uploader().destroy(extractPublicId(url), ObjectUtils.emptyMap());
            return "ok".equals(result.get("result")); // Retorna true se a exclusão foi bem-sucedida
        } catch (Exception e) {
            throw new IOException("Erro ao excluir arquivo do Cloudinary: " + e.getMessage());
        }
    }

    private String extractPublicId(String url) {
        // Exemplo: https://res.cloudinary.com/<cloud_name>/raw/upload/v1234567890/folder/file.pdf
        // O public_id seria "folder/file"
        String[] parts = url.split("/");
        String fileWithExtension = parts[parts.length - 1]; // Exemplo: file.pdf
        String publicId = url.substring(url.indexOf("upload/") + 7, url.lastIndexOf(fileWithExtension) - 1);
        return publicId;
    }
}
