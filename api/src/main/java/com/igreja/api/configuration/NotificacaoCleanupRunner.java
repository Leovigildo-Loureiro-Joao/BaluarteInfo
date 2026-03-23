package com.igreja.api.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.igreja.api.services.NotificacaoService;

@Configuration
public class NotificacaoCleanupRunner {

    private static final Logger log = LoggerFactory.getLogger(NotificacaoCleanupRunner.class);

    @Value("${app.notificacoes.cleanup.run-on-startup:true}")
    private boolean runOnStartup;

    @Bean
    ApplicationRunner notificacaoCleanupOnStartup(NotificacaoService notificacaoService) {
        return args -> {
            if (!runOnStartup) return;
            var cleaned = notificacaoService.cleanupConfigured();
            cleaned.ifPresent(count -> log.info("Cleanup de notificações (startup): {} removidas.", count));
        };
    }
}

