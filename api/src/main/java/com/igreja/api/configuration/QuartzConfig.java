package com.igreja.api.configuration;

import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.CronScheduleBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.igreja.api.jobs.GaleriaJob;
import com.igreja.api.jobs.InscritosJob;
import com.igreja.api.jobs.LembreteJob;
import com.igreja.api.jobs.MensagemPendenteJob;
import com.igreja.api.jobs.NotificacaoCleanupJob;
import com.igreja.api.jobs.VistosJob;

@Configuration
public class QuartzConfig {

    @Value("${app.jobs.galeria.cron:0 0 0/2 * * ?}")
    private String galeriaCron;

    @Value("${app.jobs.lembrete.cron:0 0 8 * * ?}")
    private String lembreteCron;

    @Value("${app.jobs.limiteInscritos.cron:0 0/10 * * * ?}")
    private String limiteInscritosCron;

    @Value("${app.jobs.vistos.cron:0 30 8 * * ?}")
    private String vistosCron;

    @Value("${app.jobs.mensagemPendentes.cron:0 0/2 * * * ?}")
    private String mensagemPendentesCron;

    @Value("${app.jobs.notificacaoCleanup.cron:0 15 3 * * ?}")
    private String notificacaoCleanupCron;
    
    @Bean
    public Trigger notifyActividadeTrigger(){
        return TriggerBuilder.newTrigger()
        .forJob(notifyActividadeDetail())
        .withIdentity("notifyActividadeTrigger")
        .withSchedule(CronScheduleBuilder.cronSchedule(galeriaCron))
        .build();
    }

    @Bean
    public JobDetail notifyActividadeDetail(){
        return JobBuilder.newJob(GaleriaJob.class)
        .withIdentity("notifyActividadeDetail")
        .storeDurably()
        .build();
    }


    @Bean
    public Trigger LembreteTrigger(){
        return TriggerBuilder.newTrigger()
        .forJob(LembreteDetail())
        .withIdentity("LembreteTrigger")
        .withSchedule(CronScheduleBuilder.cronSchedule(lembreteCron))
        .build();
    }

    @Bean
    public JobDetail LembreteDetail(){
        return JobBuilder.newJob(LembreteJob.class)
        .withIdentity("LembreteDetail")
        .storeDurably()
        .build();
    }

    @Bean
    public Trigger LimiteTrigger(){
        return TriggerBuilder.newTrigger()
        .forJob(LimiteDetail())
        .withIdentity("LimiteTrigger")
        .withSchedule(CronScheduleBuilder.cronSchedule(limiteInscritosCron))
        .build();
    }

    @Bean
    public JobDetail LimiteDetail(){
        return JobBuilder.newJob(InscritosJob.class)
        .withIdentity("LimiteDetail")
        .storeDurably()
        .build();
    }

    @Bean
    public Trigger VistosTrigger(){
        return TriggerBuilder.newTrigger()
        .forJob(VistosDetail())
        .withIdentity("VistosTrigger")
        .withSchedule(CronScheduleBuilder.cronSchedule(vistosCron))
        .build();
    }

    @Bean
    public JobDetail VistosDetail(){
        return JobBuilder.newJob(VistosJob.class)
        .withIdentity("VistosDetail")
        .storeDurably()
        .build();
    }


    @Bean
    public Trigger MensagemPendenteTrigger(){
        return TriggerBuilder.newTrigger()
        .forJob(MensagemPendenteDetail())
        .withIdentity("MensagemPendenteTrigger")
        .withSchedule(CronScheduleBuilder.cronSchedule(mensagemPendentesCron))
        .build();
    }

    @Bean
    public JobDetail MensagemPendenteDetail(){
        return JobBuilder.newJob(MensagemPendenteJob.class)
        .withIdentity("MensagemPendenteDetail")
        .storeDurably()
        .build();
    }

    @Bean
    public Trigger NotificacaoCleanupTrigger() {
        return TriggerBuilder.newTrigger()
        .forJob(NotificacaoCleanupDetail())
        .withIdentity("NotificacaoCleanupTrigger")
        .withSchedule(CronScheduleBuilder.cronSchedule(notificacaoCleanupCron))
        .build();
    }

    @Bean
    public JobDetail NotificacaoCleanupDetail() {
        return JobBuilder.newJob(NotificacaoCleanupJob.class)
        .withIdentity("NotificacaoCleanupDetail")
        .storeDurably()
        .build();
    }
}
