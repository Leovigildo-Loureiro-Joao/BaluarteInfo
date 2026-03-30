package com.igreja.api.components;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.igreja.api.enums.UserStatus;
import com.igreja.api.models.UserModel;
import com.igreja.api.repositories.UserRepository;
import com.igreja.api.services.ConfigService;

@Component
@Profile("!test")
public class DataInitializer implements CommandLineRunner{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConfigService configService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override 
    public void run(String... args) throws Exception {
        ////System.out.println("Initializing data..."); 
        if (userRepository.count() == 0) {
            UserModel admin = new UserModel("admin", passwordEncoder.encode("1234"),"leovigildojoao902@gmail.com", "ADMIN,USER");
            admin.setStatus(UserStatus.ATIVO);
            admin.setAprovadoPor("system");
            admin.setDataCadastro(LocalDateTime.now());
            admin.setDataAprovacao(LocalDateTime.now());
            userRepository.save(admin);
        }
        configService.ensureDefaults();
    }


}
