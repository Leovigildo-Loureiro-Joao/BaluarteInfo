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
import com.igreja.api.dto.config.AdminConfigDto;
import com.igreja.api.dto.config.CarouselItemDto;
import com.igreja.api.dto.config.ConfiguracaoDto;
import com.igreja.api.dto.estaticas.Value;
import com.igreja.api.dto.home.StatisticCardDto;
import com.igreja.api.enums.ConfigType;
import com.igreja.api.enums.NotificacaoType;
import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.ActividadeTipoConfigModel;
import com.igreja.api.models.ComentarioModel;
import com.igreja.api.models.ConfiguracaoModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.repositories.ActividadeRepository;
import com.igreja.api.repositories.ActividadeTipoConfigRepository;
import com.igreja.api.repositories.ComentarioRepository;
import com.igreja.api.repositories.ConfiguracaoRepository;
import com.igreja.api.repositories.InscritosRepository;
import com.igreja.api.repositories.NewlesterRepository;
import com.igreja.api.repositories.UserRepository;
import com.igreja.api.repositories.VistosRepository;
import com.igreja.api.services.CarouselItemService;

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

    @Autowired
    private CarouselItemService carouselItemService;

    @Autowired
    private ActividadeTipoConfigRepository actividadeTipoConfigRepository;

    public List<ConfiguracaoDto> AllConfiguration() {

        return configurationRepository.All();
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
        save(new ConfiguracaoDto(15, ConfigType.HistoriaAnos));
        save(new ConfiguracaoDto(500, ConfigType.MembrosTotais));
        save(new ConfiguracaoDto(30, ConfigType.MinisteriosTotais));
        save(new ConfiguracaoDto(1, ConfigType.HomeStatsVisible));
        save(new ConfiguracaoDto(1, ConfigType.HomeCarouselVisible));
        save(new ConfiguracaoDto(300000, ConfigType.DashboardRefreshIntervalMs));
        save(new ConfiguracaoDto(7, ConfigType.MensagemUnreadDays));
        save(new ConfiguracaoDto(1, ConfigType.MensagemReenviarPendentes));
        save(new ConfiguracaoDto(1, ConfigType.InscricaoQrEnabled));
        save(new ConfiguracaoDto(1, ConfigType.InscricaoQrAutoDisable));
        save(new ConfiguracaoDto(6, ConfigType.InscricaoQrExpiresHours));
    }


    public ConfiguracaoModel SelectByType(ConfigType limiteInscritos)  {
        ////System.out.println(limiteInscritos.name());
        return configurationRepository.findByType(limiteInscritos).orElseThrow(() -> new NoSuchElementException("Lamentamos mas este config não existe na base dados"));
    }

    public Map<ConfigType, Value> Estatisticas() {
        Map<ConfigType, Value> lista = new HashMap<>();
        for (ConfiguracaoModel value : configurationRepository.findAll()) {

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
            ////System.out.println(t.name()+" "+u.value()+" tot "+u.tot());
        });
        return lista;
    }

    public List<CarouselItemDto> homeCarousel() {
        return carouselItemService.listOrdered();
    }

    public List<CarouselItemDto> updateHomeCarousel(List<CarouselItemDto> items) {
        return carouselItemService.upsertAll(items);
    }

    public CarouselItemDto createHomeCarouselItem(String url, String titulo, String legenda) {
        return carouselItemService.create(url, titulo, legenda);
    }

    public StatisticCardDto[] homeStats() {
        var years = configValueOrDefault(ConfigType.HistoriaAnos, 15);
        var members = configValueOrDefault(ConfigType.MembrosTotais, 500);
        var ministries = configValueOrDefault(ConfigType.MinisteriosTotais, 30);
        return new StatisticCardDto[] {
                new StatisticCardDto("Anos de história", String.format("%.0f+", years),
                        "Marca registrada da nossa trajetória", "history"),
                new StatisticCardDto("Membros", String.format("%.0f+", members), "Família em crescimento", "users"),
                new StatisticCardDto("Ministérios", String.format("%.0f+", ministries), "Serviços atuantes", "groups")
        };
    }

    public boolean isHomeStatsVisible() {
        return configValueOrDefault(ConfigType.HomeStatsVisible, 1) > 0;
    }

    public boolean isHomeCarouselVisible() {
        return configValueOrDefault(ConfigType.HomeCarouselVisible, 1) > 0;
    }

    private double configValueOrDefault(ConfigType type, double fallback) {
        return configurationRepository.findByType(type).map(ConfiguracaoModel::getValue).orElse(fallback);
    }

    public AdminConfigDto adminConfig() {
        ensureDefaultActivityTypes();
        var dashboard = new AdminConfigDto.Dashboard(
                List.of(),
                List.of(),
                (int) configValueOrDefault(ConfigType.DashboardRefreshIntervalMs, 300000));
        var messages = new AdminConfigDto.Mensagens(
                new AdminConfigDto.Retention((int) configValueOrDefault(ConfigType.MensagemUnreadDays, 7)),
                new AdminConfigDto.Actions(configValueOrDefault(ConfigType.MensagemReenviarPendentes, 1) > 0));
        var inscricoes = new AdminConfigDto.Inscricoes(
                new AdminConfigDto.Qr(
                        configValueOrDefault(ConfigType.InscricaoQrEnabled, 1) > 0,
                        configValueOrDefault(ConfigType.InscricaoQrAutoDisable, 1) > 0,
                        (int) configValueOrDefault(ConfigType.InscricaoQrExpiresHours, 6)));
        var activities = new AdminConfigDto.Activities(listActivityTypes());
        return new AdminConfigDto(dashboard, messages, inscricoes, activities, homeCarousel());
    }

    public AdminConfigDto updateAdminConfig(AdminConfigDto dto) {
        if (dto != null) {
            if (dto.dashboard() != null) {
                upsertConfig(ConfigType.DashboardRefreshIntervalMs, dto.dashboard().refreshIntervalMs());
            }
            if (dto.messages() != null) {
                if (dto.messages().retention() != null) {
                    upsertConfig(ConfigType.MensagemUnreadDays, dto.messages().retention().unreadDays());
                }
                if (dto.messages().actions() != null) {
                    upsertConfig(ConfigType.MensagemReenviarPendentes, dto.messages().actions().reenviarPendentes() ? 1 : 0);
                }
            }
            if (dto.inscricoes() != null && dto.inscricoes().qr() != null) {
                var qr = dto.inscricoes().qr();
                upsertConfig(ConfigType.InscricaoQrEnabled, qr.enabled() ? 1 : 0);
                upsertConfig(ConfigType.InscricaoQrAutoDisable, qr.autoDisableAfterActivity() ? 1 : 0);
                upsertConfig(ConfigType.InscricaoQrExpiresHours, qr.expiresAfterHours());
            }
            if (dto.activities() != null && dto.activities().types() != null) {
                upsertActivityTypes(dto.activities().types());
            }
            if (dto.homeCarousel() != null) {
                updateHomeCarousel(dto.homeCarousel());
            }
        }
        return adminConfig();
    }

    private void upsertConfig(ConfigType type, double value) {
        ConfiguracaoModel config = configurationRepository.findByType(type).orElseGet(ConfiguracaoModel::new);
        config.setType(type);
        config.setValue(value);
        if (config.getLancado() == null) {
            config.setLancado(LocalDateTime.now());
        }
        config.setEditado(LocalDateTime.now());
        configurationRepository.save(config);
    }

    private List<AdminConfigDto.ActividadeTipoDto> listActivityTypes() {
        return actividadeTipoConfigRepository.findAll().stream()
                .map(model -> new AdminConfigDto.ActividadeTipoDto(
                        model.getId(),
                        model.getLabel(),
                        model.getColor(),
                        model.getIcon()))
                .toList();
    }

    private void ensureDefaultActivityTypes() {
        if (actividadeTipoConfigRepository.count() > 0) {
            return;
        }

        List<AdminConfigDto.ActividadeTipoDto> defaults = List.of(
                new AdminConfigDto.ActividadeTipoDto("Culto", "Culto", "#7c3aed", "GiPrayer"),
                new AdminConfigDto.ActividadeTipoDto("Evento", "Evento Especial", "#ec4899", "GiPartyPopper"),
                new AdminConfigDto.ActividadeTipoDto("Escola", "Escola Bíblica", "#3b82f6", "GiBible"),
                new AdminConfigDto.ActividadeTipoDto("Jovens", "Juventude", "#10b981", "GiHeartBeats"),
                new AdminConfigDto.ActividadeTipoDto("Familia", "Família", "#f59e0b", "GiFamilyHouse"),
                new AdminConfigDto.ActividadeTipoDto("Louvor", "Louvor", "#8b5cf6", "GiChoir"),
                new AdminConfigDto.ActividadeTipoDto("Oracao", "Oração", "#ef4444", "GiPrayer")
        );
        upsertActivityTypes(defaults);
    }

    private void upsertActivityTypes(List<AdminConfigDto.ActividadeTipoDto> types) {
        if (types == null) {
            return;
        }
        var existing = actividadeTipoConfigRepository.findAll();
        var incomingIds = types.stream()
                .map(AdminConfigDto.ActividadeTipoDto::id)
                .filter(id -> id != null && !id.isBlank())
                .toList();
        for (var old : existing) {
            if (!incomingIds.contains(old.getId())) {
                actividadeTipoConfigRepository.delete(old);
            }
        }
        for (var dto : types) {
            if (dto.id() == null || dto.id().isBlank()) {
                continue;
            }
            ActividadeTipoConfigModel model = actividadeTipoConfigRepository.findById(dto.id())
                    .orElseGet(ActividadeTipoConfigModel::new);
            model.setId(dto.id());
            model.setLabel(dto.label());
            model.setColor(dto.color());
            model.setIcon(dto.icon());
            actividadeTipoConfigRepository.save(model);
        }
    }
}
