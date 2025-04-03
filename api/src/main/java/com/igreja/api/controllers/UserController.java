package com.igreja.api.controllers;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.igreja.api.components.JwUtil;
import com.igreja.api.dto.UserDto;
import com.igreja.api.models.UserModel;
import com.igreja.api.services.UserService;

import org.springframework.web.bind.annotation.RequestBody;

import java.util.NoSuchElementException;

import javax.validation.Valid;


@Controller
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private DaoAuthenticationProvider authenticationManager;
    @Autowired
    private JwUtil jwtUtil;
    @Autowired
    PasswordEncoder passwordEncoder;
  

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody @Valid UserDto userDto) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userDto.username(), userDto.password()));
        
        UserDetails userDetails = userService.loadUserByUsername(userDto.username());
        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(token); 
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody @Valid UserDto userDto) {
        UserModel user = new UserModel();
        BeanUtils.copyProperties(userDto, user);
        user.setRoles("USER");
        user.setPassword(passwordEncoder.encode(userDto.password()));
        try {
            return ResponseEntity.ok(userService.save(user));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.FOUND).body(e.getMessage());
        }
     
    }

   
    
}
