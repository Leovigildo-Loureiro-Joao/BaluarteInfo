package com.igreja.api.services;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
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

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudDinaryService {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(CloudDinaryService.class);
    private final Cloudinary cloudinary;
    private final ExecutorService uploadExecutor; // Pool dedicado para uploads

    public CloudDinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
        this.uploadExecutor = Executors.newVirtualThreadPerTaskExecutor(); // Pool com 4 threads
    }

    // Mantido por compatibilidade: chamadas antigas não são mais necessárias.
    public void generateUniqueName(String originalFilename) {
        // no-op (o serviço agora é stateless e gera public_id por upload)
    }

    private static String safeBaseName(String originalFilename) {
        String base = originalFilename == null ? "" : originalFilename.trim();
        if (base.isBlank()) {
            base = "file";
        }
        // Alguns browsers enviam "C:\\fakepath\\arquivo.pdf"
        base = base.replace('\\', '/');
        int lastSlash = base.lastIndexOf('/');
        if (lastSlash >= 0 && lastSlash + 1 < base.length()) {
            base = base.substring(lastSlash + 1);
        }
        return base;
    }

    private static String stripExtension(String name) {
        if (name == null) {
            return "";
        }
        int dot = name.lastIndexOf('.');
        if (dot <= 0) {
            return name;
        }
        return name.substring(0, dot);
    }

    private static String sanitizePublicId(String raw) {
        String value = raw == null ? "" : raw.trim();
        if (value.isBlank()) {
            value = UUID.randomUUID().toString();
        }

        value = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "");

        // Mantém apenas caracteres seguros para URL/path
        value = value.replaceAll("[^A-Za-z0-9_-]+", "_")
                .replaceAll("_+", "_")
                .replaceAll("^_+|_+$", "");

        if (value.isBlank()) {
            value = UUID.randomUUID().toString();
        }
        if (value.length() > 150) {
            value = value.substring(0, 150);
        }
        return value;
    }

    private static String buildPublicIdFromFilename(String originalFilename) {
        String base = safeBaseName(originalFilename);
        String withoutExt = stripExtension(base);
        String unique = UUID.randomUUID() + "_" + withoutExt;
        return sanitizePublicId(unique);
    }

    // Upload assíncrono para MultipartFile
    public String uploadFileAsync(MultipartFile file, String resourceType) throws InterruptedException, ExecutionException, TimeoutException {
        return uploadExecutor.submit(() -> {
            try {
            String publicId = buildPublicIdFromFilename(file == null ? null : file.getOriginalFilename());
            
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), 
                ObjectUtils.asMap(
                    "resource_type", resourceType,
                    "folder", "upload",
                    "timeout", 4000,
                    "quality", "auto:fast",
                    "public_id", publicId,
                    "filename_override", publicId
                ));
                Object secure = uploadResult.get("secure_url");
                Object plain = uploadResult.get("url");
                return (secure != null ? secure : plain).toString();
            } catch (IOException e) {
                
                throw new RuntimeException("Falha no upload do arquivo", e);
            }
        }).get(30, TimeUnit.SECONDS); // ✅ Tempo aumentado
    }

    public CloudinaryUploadResult uploadFileWithInfoAsync(MultipartFile file, String resourceType)
            throws InterruptedException, ExecutionException, TimeoutException {
        return uploadExecutor.submit(() -> {
            try {
                String publicId = buildPublicIdFromFilename(file == null ? null : file.getOriginalFilename());

                Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                        ObjectUtils.asMap(
                                "resource_type", resourceType,
                                "folder", "upload",
                                "timeout", 4000,
                                "quality", "auto:fast",
                                "public_id", publicId,
                                "filename_override", publicId));

                String url = uploadResult.containsKey("secure_url")
                        ? uploadResult.get("secure_url").toString()
                        : uploadResult.get("url").toString();

                Double duration = null;
                Object durationObj = uploadResult.get("duration");
                if (durationObj instanceof Number number) {
                    duration = number.doubleValue();
                } else if (durationObj != null) {
                    try {
                        duration = Double.parseDouble(durationObj.toString());
                    } catch (NumberFormatException ignored) {
                        duration = null;
                    }
                }

                return new CloudinaryUploadResult(url, duration);
            } catch (IOException e) {
                throw new RuntimeException("Falha no upload do arquivo", e);
            }
        }).get(30, TimeUnit.SECONDS);
    }


    public String uploadFileAsync(byte[] file, String resourceType) throws InterruptedException, ExecutionException, TimeoutException {
        return uploadExecutor.submit(() -> {
            try {
                ////System.out.println(this.uniqueName);
            String publicId = sanitizePublicId(UUID.randomUUID().toString());
            
            Map uploadResult = cloudinary.uploader().upload(file, 
                ObjectUtils.asMap(
                    "resource_type", resourceType,
                    "folder", "upload",
                    "timeout", 4000,
                    "quality", "auto:fast",
                    "public_id", publicId
                ));
                    ////System.out.println(this.uniqueName); 
                Object secure = uploadResult.get("secure_url");
                Object plain = uploadResult.get("url");
                return (secure != null ? secure : plain).toString();
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
                String publicId = sanitizePublicId(UUID.randomUUID().toString());
                Map uploadResult = cloudinary.uploader().upload(imageBytes, 
                    ObjectUtils.asMap(
                        "resource_type", resourceType,
                        "folder", "upload",
                         "timeout", 4000,
                        "quality", "auto:fast",
                        "public_id", publicId
                    ));
                Object secure = uploadResult.get("secure_url");
                Object plain = uploadResult.get("url");
                return (secure != null ? secure : plain).toString();
            } catch (IOException e) {
                throw new RuntimeException("Falha no upload da imagem", e);
            }
        }).get(30, TimeUnit.SECONDS); // ✅ Tempo aumentado
    }

    // Upload assíncrono para imagem enviada como MultipartFile (capa)
    public String uploadImageFileAsync(MultipartFile imageFile, String resourceType)
            throws InterruptedException, ExecutionException, TimeoutException {
        return uploadExecutor.submit(() -> {
            try {
                String publicId = buildPublicIdFromFilename(imageFile == null ? null : imageFile.getOriginalFilename());
                Map uploadResult = cloudinary.uploader().upload(imageFile.getBytes(),
                        ObjectUtils.asMap(
                                "resource_type", resourceType,
                                "folder", "upload",
                                "timeout", 4000,
                                "quality", "auto:fast",
                                "public_id", publicId,
                                "filename_override", publicId));
                return uploadResult.containsKey("secure_url")
                        ? uploadResult.get("secure_url").toString()
                        : uploadResult.get("url").toString();
            } catch (IOException e) {
                throw new RuntimeException("Falha no upload da imagem", e);
            }
        }).get(30, TimeUnit.SECONDS);
    }
   
    // Exclusão assíncrona
    public CompletableFuture<Boolean> deleteFileAsync(String url) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String publicId = extractPublicId(url);
                String resourceType = detectResourceType(url);
                Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", resourceType));
                Object value = result == null ? null : result.get("result");
                String status = value == null ? "" : value.toString();

                // "not found" pode acontecer quando o asset já foi removido/renomeado: trata como sucesso idempotente.
                boolean success = "ok".equalsIgnoreCase(status) || "not found".equalsIgnoreCase(status);
                if (!success) {
                    log.warn("Cloudinary destroy falhou (resourceType={}, publicId={}, result={})", resourceType, publicId, status);
                } else {
                    log.debug("Cloudinary destroy ok (resourceType={}, publicId={}, result={})", resourceType, publicId, status);
                }
                return success;
            } catch (Exception e) {
                log.warn("Falha ao excluir arquivo no Cloudinary (url={})", url, e);
                throw new RuntimeException("Falha ao excluir arquivo", e);
            }
        }, uploadExecutor);
    }

    public CompletableFuture<Boolean> deleteFileIfCloudinaryAsync(String url) {
        if (url == null || url.isBlank()) {
            return CompletableFuture.completedFuture(true);
        }
        // Placeholders externos ou URLs que não são do Cloudinary (ex.: Google/YouTube/etc.)
        if (!isCloudinaryUrl(url)) {
            return CompletableFuture.completedFuture(true);
        }
        return deleteFileAsync(url);
    }

    private static boolean isCloudinaryUrl(String url) {
        if (url == null) {
            return false;
        }
        String value = url.toLowerCase();
        // Evita falsos positivos (ex.: endpoints de Google APIs com "/upload/")
        boolean looksLikeCloudinaryHost = value.contains("res.cloudinary.com") || value.contains(".cloudinary.com");
        return looksLikeCloudinaryHost && value.contains("/upload/");
    }

    // Extração segura do public_id
    private String extractPublicId(String url) {
        if (url == null || url.isBlank()) {
            throw new IllegalArgumentException("URL do Cloudinary vazia");
        }

        // Remove querystring/fragments
        String clean = url.split("\\?")[0].split("#")[0];
        int uploadIndex = clean.indexOf("/upload/");
        int start;
        if (uploadIndex != -1) {
            start = uploadIndex + "/upload/".length();
        } else {
            // Alguns links podem vir como "...upload/..." (sem a barra anterior)
            uploadIndex = clean.indexOf("upload/");
            if (uploadIndex == -1) {
                throw new IllegalArgumentException("URL do Cloudinary inválida (sem /upload/)");
            }
            start = uploadIndex + "upload/".length();
        }

        // Pega tudo após "/upload/" (ou "upload/")
        String afterUpload = clean.substring(start);

        // Remove versão "v1234567890/" se existir
        afterUpload = afterUpload.replaceFirst("^v\\d+/", "");

        // Remove extensão apenas do último segmento
        int lastSlash = afterUpload.lastIndexOf('/');
        String folder = lastSlash >= 0 ? afterUpload.substring(0, lastSlash + 1) : "";
        String last = lastSlash >= 0 ? afterUpload.substring(lastSlash + 1) : afterUpload;
        int lastDot = last.lastIndexOf('.');
        if (lastDot > 0) {
            last = last.substring(0, lastDot);
        }
        String publicId = (folder + last).trim();
        if (publicId.isBlank()) {
            throw new IllegalArgumentException("URL do Cloudinary inválida (public_id vazio)");
        }
        return publicId;
    }

    private String detectResourceType(String url) {
        if (url == null) {
            return "image";
        }
        String value = url.toLowerCase();
        if (value.contains("/video/upload/")) {
            return "video";
        }
        if (value.contains("/raw/upload/")) {
            return "raw";
        }
        if (value.contains("/image/upload/")) {
            return "image";
        }
        // Fallback: Cloudinary audio geralmente é servido como "video"
        if (value.endsWith(".mp3") || value.endsWith(".wav") || value.endsWith(".m4a") || value.endsWith(".aac") || value.endsWith(".ogg")) {
            return "video";
        }
        return "image";
    }
}
