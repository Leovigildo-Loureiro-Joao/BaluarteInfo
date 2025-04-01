package com.igreja.api.utils;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;


public class UploadUtils {
    public MultipartFile fileSelect;
    public Path pathSelect;
    public String unique;
    public void PrepararUpload(MultipartFile file,String kindName){
        try {
            if (file==null&&file.isEmpty()&&!file.getContentType().contains(kindName)) {
                return;
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
            fileSelect=file;
        } catch (IOException e) {
            e.printStackTrace();
        }
      
    } 

    public void Upload() throws IOException{
        if (fileSelect.isEmpty()) {
            throw new IOException("Sem ficheiro");
        }
        try (InputStream fileInputStream = fileSelect.getInputStream()) {
            Files.copy(fileInputStream, pathSelect, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IOException("Erro ao fazer o upload");
        }
    }
}
