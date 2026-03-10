package com.igreja.api.jobs;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.igreja.api.services.NotificacaoService;

public class VistosJob implements Job {
    private static final Logger log = LoggerFactory.getLogger(VistosJob.class);

    @Autowired
    private NotificacaoService notificacaoService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        try {
            notificacaoService.notifyVistos();
        } catch (Exception e) {
            log.error("Falha ao executar job de notificações de vistos.", e);
            throw new JobExecutionException("Falha ao executar job de vistos.", e, false);
        }
    }
}
