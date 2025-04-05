package com.igreja.api.components;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.igreja.api.models.UserModel;
import com.igreja.api.repositories.UserRepository;
import com.igreja.api.services.ConfigService;

@Component
public class DataInitializer implements CommandLineRunner{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConfigService configService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override 
    public void run(String... args) throws Exception {
        System.out.println("Initializing data..."); 
        if (userRepository.count() == 0) {
            UserModel admin = new UserModel("admin", passwordEncoder.encode("1234"),"leovigildojoao902@gmail.com", "ADMIN,USER");
            userRepository.save(admin); 
                        
        }
    }


}
