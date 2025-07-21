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
}