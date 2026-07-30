package com.igreja.api.jobs;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.InterruptableJob;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.UnableToInterruptJobException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.igreja.api.services.NotificacaoService;

@DisallowConcurrentExecution
public class VistosJob implements InterruptableJob {
    private static final Logger log = LoggerFactory.getLogger(VistosJob.class);
    private volatile boolean interrupted = false;

    @Autowired
    private NotificacaoService notificacaoService;

    @Override
    public void interrupt() throws UnableToInterruptJobException {
        interrupted = true;
    }

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
