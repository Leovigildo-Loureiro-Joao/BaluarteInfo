package com.igreja.api.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import io.github.cdimascio.dotenv.Dotenv;

@Configuration
public class CloudinayConfig {
    @Bean
    public Cloudinary cloudinary() {
        Dotenv dotenv = Dotenv.load();
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", dotenv.get("CLOUD_NAME"),
            "api_key", dotenv.get("API_KEY"),
            "api_secret", dotenv.get("API_SECRET")
        ));
    }
}
