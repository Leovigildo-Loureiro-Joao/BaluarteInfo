package com.igreja.api.jobs;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;

import com.igreja.api.services.NotificacaoService;

public class LembreteJob implements Job{
     @Autowired
    private NotificacaoService notificacaoService;

    @Override
    public void execute(JobExecutionContext arg0) throws JobExecutionException {
        try {
            System.out.println("Iniciando o job Lembrete...");
            notificacaoService.NotifyActividadeLembrete();
            System.out.println("Job executado com sucesso...");
        } catch (Exception e) {
            System.out.println("Job falhou Lembrete:  "+e.getMessage()); 
        }
    }
}
