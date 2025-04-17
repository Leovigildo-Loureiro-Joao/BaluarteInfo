package com.igreja.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;

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
		SpringApplication.run(ApiApplication.class, args);
	}

}
