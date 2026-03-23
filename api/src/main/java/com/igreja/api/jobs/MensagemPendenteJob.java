package com.igreja.api.jobs;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.igreja.api.enums.ConfigType;
import com.igreja.api.services.ConfigService;
import com.igreja.api.services.MensagemService;

@DisallowConcurrentExecution
public class MensagemPendenteJob implements Job{

    private static final Logger log = LoggerFactory.getLogger(MensagemPendenteJob.class);

    @Autowired
    private MensagemService mensagemService;

    @Autowired
    private ConfigService configService;

    @Override
    public void execute(JobExecutionContext arg0) throws JobExecutionException {
        try {
            boolean enabled = configService.numberValueOrDefault(ConfigType.MensagemReenviarPendentes, 1) > 0;
            if (!enabled) {
                return;
            }
            mensagemService.EnviarAsPendentes();
        } catch (Exception e) {
            log.error("Falha ao reenviar mensagens pendentes.", e);
        }
    }
    
}
