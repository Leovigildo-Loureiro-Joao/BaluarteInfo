package com.igreja.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.github.cdimascio.dotenv.Dotenv;

@OpenAPIDefinition(
	info = @Info(
		title = "API BaluarteSiteInfo",
		version = "v1",
		contact = @Contact(email = "leovigildojoao902@gmail.com",name = "Leovigildo Loureiro João"),
		description = "Documentação da API do Igreja Baluarte"
	)
)
@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.igreja.api.repositories")
@EntityScan(basePackages = "com.igreja.api.models")
public class ApiApplication {

	public static void main(String[] args) {
	 Dotenv dotenv = Dotenv.configure().load();
    System.setProperty("DB_URL", dotenv.get("DB_URL"));
    System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
    System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
    System.setProperty("CLOUDINARY_CLOUD_NAME", dotenv.get("CLOUDINARY_CLOUD_NAME"));
    System.setProperty("CLOUDINARY_API_KEY", dotenv.get("CLOUDINARY_API_KEY"));
    System.setProperty("CLOUDINARY_API_SECRET", dotenv.get("CLOUDINARY_API_SECRET"));
    System.setProperty("PORT", dotenv.get("PORT"));
    System.setProperty("SMTP_USER", dotenv.get("SMTP_USER"));
    System.setProperty("SMTP_PASS", dotenv.get("SMTP_PASS"));
		SpringApplication.run(ApiApplication.class, args);
	}

}
