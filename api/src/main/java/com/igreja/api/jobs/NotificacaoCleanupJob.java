package com.igreja.api.jobs;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.igreja.api.services.NotificacaoService;

@DisallowConcurrentExecution
public class NotificacaoCleanupJob implements Job {

    private static final Logger log = LoggerFactory.getLogger(NotificacaoCleanupJob.class);

    @Autowired
    private NotificacaoService notificacaoService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        try {
            var cleaned = notificacaoService.cleanupConfigured();
            cleaned.ifPresent(count -> log.info("Cleanup de notificações (job): {} removidas.", count));
        } catch (Exception e) {
            log.error("Falha no cleanup de notificações.", e);
        }
    }
}

