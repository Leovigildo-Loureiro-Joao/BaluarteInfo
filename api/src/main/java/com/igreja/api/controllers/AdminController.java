package com.igreja.api.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.igreja.api.services.ConfigService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import com.igreja.api.dto.estaticas.AdminDashboardStatsDto;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class AdminController {
    
     @Autowired
    private ConfigService cpConfigService;

    @GetMapping("/admin/statics")
    public ResponseEntity<?> Estatisticas() {

        return ResponseEntity.ok().body(cpConfigService.Estatisticas());
    }

    @GetMapping("/admin/dashboard/stats")
    public ResponseEntity<AdminDashboardStatsDto> dashboardStats(
            @RequestParam(name = "periodo", required = false) String periodo) {
        return ResponseEntity.ok(cpConfigService.dashboardStats(periodo));
    }

    @GetMapping("/admin/dashboard/charts")
    public ResponseEntity<?> dashboardCharts(
            @RequestParam(name = "periodo", required = false) String periodo) {
        return ResponseEntity.ok(cpConfigService.Charts(periodo));
    }
    
}
