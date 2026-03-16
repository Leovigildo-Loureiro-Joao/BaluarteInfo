package com.igreja.api.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.url:${CLOUDINARY_URL:}}")
    private String cloudinaryUrl;

    @Value("${cloudinary.cloud_name:${CLOUDINARY_CLOUD_NAME:}}")
    private String cloudName;

    @Value("${cloudinary.api_key:${CLOUDINARY_API_KEY:}}")
    private String apiKey;

    @Value("${cloudinary.api_secret:${CLOUDINARY_API_SECRET:}}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        if (cloudinaryUrl != null && !cloudinaryUrl.isBlank()) {
            return new Cloudinary(cloudinaryUrl.trim());
        }

        String safeCloudName = cloudName == null ? "" : cloudName.trim();
        String safeApiKey = apiKey == null ? "" : apiKey.trim();
        String safeApiSecret = apiSecret == null ? "" : apiSecret.trim();

        if (safeCloudName.isBlank() || safeApiKey.isBlank() || safeApiSecret.isBlank()) {
            throw new IllegalStateException(
                    "Cloudinary não configurado. Defina CLOUDINARY_URL ou CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET.");
        }
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", safeCloudName,
            "api_key", safeApiKey,
            "api_secret", safeApiSecret
        ));
    }
}

