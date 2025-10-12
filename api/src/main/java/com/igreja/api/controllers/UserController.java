package com.igreja.api.controllers;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.components.JwUtil;
import com.igreja.api.dto.user.UserDto;
import com.igreja.api.dto.user.UserDtoData;
import com.igreja.api.dto.user.UserLoginDto;
import com.igreja.api.models.UserModel;
import com.igreja.api.services.UserService;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;
import java.util.NoSuchElementException;

import javax.validation.Valid;


@RestController
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
    public ResponseEntity<?> login(@RequestBody @Valid UserLoginDto userDto) {
        UserDetails userDetails = userService.loadUserByUsername(userDto.email());
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userDetails.getUsername(), userDto.password()));
        // Generate JWT token
        String token = jwtUtil.generateToken(userDetails);
        return ResponseEntity.ok(Map.of("token", token,"user",userService.findByIdData(userDto.email()))); 
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


     @GetMapping("/auth/{id}")
    public ResponseEntity<?> FindUser(@PathVariable("id") long user) {
        ;
        try {
            return ResponseEntity.ok(userService.findByIdData(user));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.FOUND).body(e.getMessage());
        }
     
    }

     @GetMapping("/admin/user")
    public ResponseEntity<?> AllUser() {
        ;
        try {
            return ResponseEntity.ok(userService.findAll());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.FOUND).body(e.getMessage());
        }
     
    }
   
    
}
