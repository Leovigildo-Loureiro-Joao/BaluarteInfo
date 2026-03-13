package com.igreja.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.dto.home.HomeDto;
import com.igreja.api.services.HomeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/user/home")
@RequiredArgsConstructor
public class HomeController {

    private final HomeService homeService;

    @GetMapping
    public ResponseEntity<HomeDto> home() {
        return ResponseEntity.ok(homeService.HomeData());
    }
}
