package com.igreja.api.dto.file;

import java.io.File;

import org.springframework.web.multipart.MultipartFile;

import com.igreja.api.enums.FileType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record FileDto(@NotNull File file,@NotBlank String model,@NotBlank String kindFormat,@NotBlank FileType format) {
    
}
