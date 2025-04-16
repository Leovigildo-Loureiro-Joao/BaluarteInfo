package com.igreja.api.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.comentario.ComentarioDto;
import com.igreja.api.dto.config.ConfiguracaoDto;
import com.igreja.api.enums.ConfigType;
import com.igreja.api.enums.NotificacaoType;
import com.igreja.api.models.ComentarioModel;
import com.igreja.api.models.ConfiguracaoModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.repositories.ConfiguracaoRepository;

@Service
public class ConfigService {
    
    @Autowired
    private ConfiguracaoRepository configurationRepository;

    public List<ConfiguracaoModel> AllConfiguration() {
        return configurationRepository.findAll();
    }

    private ConfiguracaoModel save(ConfiguracaoDto dto){
        ConfiguracaoModel config=new ConfiguracaoModel();
        config.setLancado(LocalDateTime.now());
        config.setEditado(LocalDateTime.now());
        BeanUtils.copyProperties(dto, config);
        return configurationRepository.save(config);
    }

    public ConfiguracaoModel edit(ConfiguracaoDto dto){
        ConfiguracaoModel config=configurationRepository.findByType(dto.type()).orElse(null);
        config.setEditado(LocalDateTime.now());
        BeanUtils.copyProperties(dto, config);
        return configurationRepository.save(config);
    }

    public void StartUse(){
        save(new ConfiguracaoDto(100, ConfigType.ActividadeLimite));
        save(new ConfiguracaoDto(50, ConfigType.ComentarioLimite));
        save(new ConfiguracaoDto(100, ConfigType.IncritosLimite));
        save(new ConfiguracaoDto(50, ConfigType.MembrosLimite));
        save(new ConfiguracaoDto(100, ConfigType.VisitasLimite));
    }


    public ConfiguracaoModel SelectByType(ConfigType limiteInscritos)  {
        return configurationRepository.findByType(limiteInscritos).orElseThrow(() -> new NoSuchElementException("Lamentamos mas este config não existe na base dados"));
    }
}
