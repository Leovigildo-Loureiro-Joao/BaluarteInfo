package com.igreja.api.controllers;

import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.Map;

import javax.validation.Valid;


@RestController
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public UserController(
            UserService userService,
            AuthenticationManager authenticationManager,
            JwUtil jwtUtil,
            PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }
  

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody @Valid UserLoginDto userDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userDto.email(), userDto.password()));
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);
        return ResponseEntity.ok(Map.of("token", token,"user",userService.findByIdData(userDto.email()))); 
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody @Valid UserDto userDto) {
        UserModel user = new UserModel();
        BeanUtils.copyProperties(userDto, user);
        user.setRoles("USER");
        user.setPassword(passwordEncoder.encode(userDto.password()));
        return ResponseEntity.ok(userService.save(user));
    }


    @GetMapping("/user/me")
    public ResponseEntity<?> currentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.findByIdData(userDetails.getUsername()));
    }

     @GetMapping("/admin/user")
    public ResponseEntity<?> AllUser() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/admin/user/{id}")
    public ResponseEntity<?> findUserById(@PathVariable("id") long user) {
        return ResponseEntity.ok(userService.findByIdData(user));
    }
   
    
}
