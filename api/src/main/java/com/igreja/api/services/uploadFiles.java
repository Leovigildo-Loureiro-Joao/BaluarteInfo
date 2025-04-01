package com.igreja.api.services;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;


public class uploadFiles {
    public MultipartFile fileSelect;
    public Path pathSelect;
    public String unique;
    public  Map<String, Object> PrepararUpload(MultipartFile file,String kindName){
        try {
            if (file.isEmpty()) {
                return Map.of( "status",HttpStatus.BAD_REQUEST, "name",file);
            }
            if (!file.getContentType().contains(kindName)) {
                return Map.of( "status",HttpStatus.UNSUPPORTED_MEDIA_TYPE, "name",file);
            }

            String filename=StringUtils.cleanPath(file.getOriginalFilename());

            Path uploadPath= Paths.get("uploads");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String uniqueName = UUID.randomUUID().toString() + "_" + filename;
            Path path = uploadPath.resolve(uniqueName);

            pathSelect=path;
            unique=uniqueName;
            return Map.of("status",HttpStatus.OK,"img", uniqueName);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
      
    } 

    public void Upload() throws IOException{
        try (InputStream fileInputStream = fileSelect.getInputStream()) {
            Files.copy(fileInputStream, pathSelect, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IOException("Erro ao fazer o upload");
        }
    }
}
