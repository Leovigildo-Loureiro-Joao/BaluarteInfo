package com.igreja.api.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.comentario.ComentarioDto;
import com.igreja.api.dto.config.ConfiguracaoDto;
import com.igreja.api.dto.estaticas.Value;
import com.igreja.api.enums.ConfigType;
import com.igreja.api.enums.NotificacaoType;
import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.ComentarioModel;
import com.igreja.api.models.ConfiguracaoModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.repositories.ActividadeRepository;
import com.igreja.api.repositories.ComentarioRepository;
import com.igreja.api.repositories.ConfiguracaoRepository;
import com.igreja.api.repositories.InscritosRepository;
import com.igreja.api.repositories.NewlesterRepository;
import com.igreja.api.repositories.UserRepository;
import com.igreja.api.repositories.VistosRepository;

@Service
public class ConfigService {
    
    @Autowired
    private ConfiguracaoRepository configurationRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActividadeRepository actividadeRepository;

    @Autowired
    private InscritosRepository inscritosRepository;

    @Autowired
    private VistosRepository vistosRepository;

    @Autowired
    private NewlesterRepository newlesterRepository;

    @Autowired
    private ComentarioRepository comentarioRepository;

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
        save(new ConfiguracaoDto(50, ConfigType.ComentarioLimiteActividade));
        save(new ConfiguracaoDto(100, ConfigType.IncritosLimiteActividade));
        save(new ConfiguracaoDto(50, ConfigType.MembrosLimite));
        save(new ConfiguracaoDto(100, ConfigType.VisitasLimite));
        save(new ConfiguracaoDto(100, ConfigType.NewlesterLimite));
    }


    public ConfiguracaoModel SelectByType(ConfigType limiteInscritos)  {
        System.out.println(limiteInscritos.name());
        return configurationRepository.findByType(limiteInscritos).orElseThrow(() -> new NoSuchElementException("Lamentamos mas este config não existe na base dados"));
    }

    public Map<ConfigType, Value> Estatisticas() {
        Map<ConfigType, Value> lista = new HashMap<>();
        for (ConfiguracaoModel value : AllConfiguration()) {

            switch (value.getType()) {
                case MembrosLimite:
                    lista.put(value.getType(), new Value(userRepository.count() - 1, value.getValue()));
                    break;
                case ActividadeLimite:
                    lista.put(value.getType(), new Value(actividadeRepository.count(), value.getValue()));
                    int inscrito = 0;
                    int comentario = 0;
                    for (ActividadeModel actividadeModel : actividadeRepository.findAll()) {
                        inscrito += inscritosRepository.findByActividade(actividadeModel).size();
                        comentario += comentarioRepository.findByActividade(actividadeModel).size();
                    }
                    lista.put(ConfigType.IncritosLimiteActividade, new Value(inscrito, SelectByType(ConfigType.IncritosLimiteActividade).getValue()));
                    lista.put(ConfigType.ComentarioLimiteActividade, new Value(comentario, SelectByType(ConfigType.ComentarioLimiteActividade).getValue()));
                    break;
                case VisitasLimite:
                    lista.put(value.getType(), new Value(vistosRepository.count(), value.getValue()));
                    break;
                case NewlesterLimite:
                    lista.put(value.getType(), new Value(newlesterRepository.count(), value.getValue()));
                    break;
                default:
                    break;
            }
        }
        lista.forEach((t, u) -> {
            System.out.println(t.name()+" "+u.value()+" tot "+u.tot());
        });
        return lista;
    }
}
