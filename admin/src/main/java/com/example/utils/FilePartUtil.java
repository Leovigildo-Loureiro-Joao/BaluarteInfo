package com.example.utils;

import java.nio.file.Path;
public  class FilePartUtil {
    public Path filePath;
    public String fieldName;
    public String mimeType;

    public FilePartUtil(Path filePath, String fieldName, String mimeType) {
        this.filePath = filePath;
        this.fieldName = fieldName;
        this.mimeType = mimeType;
    }

    public static String Formato(String type, String url) {
        String ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
        switch (ext) {
            case "jpg":
            case "jpeg": return "image/jpeg";
            case "png": return "image/png";
            case "gif": return "image/gif";
            case "bmp": return "image/bmp";
            case "webp": return "image/webp";
            case "mp3": return "audio/mpeg";
            case "wav": return "audio/wav";
            case "ogg": return "audio/ogg";
            default: return type + "/" + ext; // fallback
        }
    }
}