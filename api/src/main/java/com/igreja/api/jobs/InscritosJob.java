package com.igreja.api.jobs;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;

import com.igreja.api.services.NotificacaoService;

public class InscritosJob implements Job{
     @Autowired
    private NotificacaoService notificacaoService;

    @Override
    public void execute(JobExecutionContext arg0) throws JobExecutionException {
        try {
            notificacaoService.NotifyActividadeLimiteInscritos();;
        } catch (Exception e) {
            System.out.println("Job falhou Inscritos:  "+e.getMessage()); 
        }
    }
}
