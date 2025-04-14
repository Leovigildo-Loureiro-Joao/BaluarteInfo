package com.igreja.api.configuration;

import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.igreja.api.jobs.GaleriaJob;
import com.igreja.api.jobs.InscritosJob;
import com.igreja.api.jobs.LembreteJob;
import com.igreja.api.jobs.MensagemPendenteJob;
import com.igreja.api.jobs.VistosJob;

@Configuration
public class QuartzConfig {
    
    @Bean
    public Trigger notifyActividadeTrigger(){
        SimpleScheduleBuilder scheduleBuilder=SimpleScheduleBuilder.simpleSchedule()
        .withIntervalInSeconds(20)
        .repeatForever();
        
        return TriggerBuilder.newTrigger()
        .forJob(notifyActividadeDetail())
        .withIdentity("notifyActividadeTrigger")
        .withSchedule(scheduleBuilder)
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
        SimpleScheduleBuilder scheduleBuilder=SimpleScheduleBuilder.simpleSchedule()
        .withIntervalInSeconds(20)
        .repeatForever();
        
        return TriggerBuilder.newTrigger()
        .forJob(LembreteDetail())
        .withIdentity("LembreteTrigger")
        .withSchedule(scheduleBuilder)
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
        SimpleScheduleBuilder scheduleBuilder=SimpleScheduleBuilder.simpleSchedule()
        .withIntervalInSeconds(20)
        .repeatForever();
        
        return TriggerBuilder.newTrigger()
        .forJob(LimiteDetail())
        .withIdentity("LimiteTrigger")
        .withSchedule(scheduleBuilder)
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
        SimpleScheduleBuilder scheduleBuilder=SimpleScheduleBuilder.simpleSchedule()
        .withIntervalInSeconds(20)
        .repeatForever();
        
        return TriggerBuilder.newTrigger()
        .forJob(VistosDetail())
        .withIdentity("VistosTrigger")
        .withSchedule(scheduleBuilder)
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
        SimpleScheduleBuilder scheduleBuilder=SimpleScheduleBuilder.simpleSchedule()
        .withIntervalInSeconds(20)
        .repeatForever();
        
        return TriggerBuilder.newTrigger()
        .forJob(MensagemPendenteDetail())
        .withIdentity("MensagemPendenteTrigger")
        .withSchedule(scheduleBuilder)
        .build();
    }

    @Bean
    public JobDetail MensagemPendenteDetail(){
        return JobBuilder.newJob(MensagemPendenteJob.class)
        .withIdentity("MensagemPendenteDetail")
        .storeDurably()
        .build();
    }
}
