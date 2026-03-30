package com.igreja.api.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Set;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.igreja.api.dto.comentario.ComentarioDto;
import com.igreja.api.dto.config.AdminConfigDto;
import com.igreja.api.dto.config.CarouselItemDto;
import com.igreja.api.dto.config.ConfiguracaoDto;
import com.igreja.api.dto.config.PublicContactConfigDto;
import com.igreja.api.dto.estaticas.AdminDashboardStatsDto;
import com.igreja.api.dto.estaticas.Value;
import com.igreja.api.dto.home.StatisticCardDto;
import com.igreja.api.enums.ConfigType;
import com.igreja.api.enums.MidiaType;
import com.igreja.api.enums.NotificacaoType;
import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.ActividadeTipoConfigModel;
import com.igreja.api.models.ComentarioModel;
import com.igreja.api.models.ConfiguracaoModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.repositories.ActividadeRepository;
import com.igreja.api.repositories.ActividadeTipoConfigRepository;
import com.igreja.api.repositories.ArtigosRepository;
import com.igreja.api.repositories.ComentarioLikeRepository;
import com.igreja.api.repositories.ComentarioRepository;
import com.igreja.api.repositories.ConfiguracaoRepository;
import com.igreja.api.repositories.InscritosRepository;
import com.igreja.api.repositories.MidiaRepository;
import com.igreja.api.repositories.NewlesterRepository;
import com.igreja.api.repositories.UserDownloadRepository;
import com.igreja.api.repositories.UserRepository;
import com.igreja.api.repositories.VistosRepository;
import com.igreja.api.services.CarouselItemService;

@Service
public class ConfigService {
    
    @Autowired
    private ConfiguracaoRepository configurationRepository;

    @Autowired
    private ArtigosRepository artigosRepository;

    @Autowired
    private MidiaRepository midiaRepository;
    
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
    private ComentarioLikeRepository comentarioLikeRepository;

    @Autowired
    private UserDownloadRepository userDownloadRepository;

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
        ConfiguracaoModel config = configurationRepository.findByType(dto.type()).orElseGet(ConfiguracaoModel::new);
        config.setType(dto.type());
        if (config.getLancado() == null) {
            config.setLancado(LocalDateTime.now());
        }
        config.setEditado(LocalDateTime.now());
        BeanUtils.copyProperties(dto, config);
        return configurationRepository.save(config);
    }

    public void StartUse() {
        ensureDefaults();
    }

    public void ensureDefaults() {
        ensureConfig(ConfigType.ActividadeLimite, JsonNodeFactory.instance.numberNode(100));
        ensureConfig(ConfigType.ComentarioLimiteActividade, JsonNodeFactory.instance.numberNode(50));
        ensureConfig(ConfigType.IncritosLimiteActividade, JsonNodeFactory.instance.numberNode(100));
        ensureConfig(ConfigType.MembrosLimite, JsonNodeFactory.instance.numberNode(50));
        ensureConfig(ConfigType.VisitasLimite, JsonNodeFactory.instance.numberNode(100));
        ensureConfig(ConfigType.NewlesterLimite, JsonNodeFactory.instance.numberNode(100));
        ensureConfig(ConfigType.HistoriaAnos, JsonNodeFactory.instance.numberNode(15));
        ensureConfig(ConfigType.MembrosTotais, JsonNodeFactory.instance.numberNode(500));
        ensureConfig(ConfigType.MinisteriosTotais, JsonNodeFactory.instance.numberNode(30));
        ensureConfig(ConfigType.HomeStatsVisible, JsonNodeFactory.instance.numberNode(1));
        ensureConfig(ConfigType.HomeCarouselVisible, JsonNodeFactory.instance.numberNode(1));
        ensureConfig(ConfigType.DashboardRefreshIntervalMs, JsonNodeFactory.instance.numberNode(300000));
        ensureConfig(ConfigType.MensagemUnreadDays, JsonNodeFactory.instance.numberNode(7));
        ensureConfig(ConfigType.MensagemReenviarPendentes, JsonNodeFactory.instance.numberNode(1));
        ensureConfig(ConfigType.InscricaoQrEnabled, JsonNodeFactory.instance.numberNode(1));
        ensureConfig(ConfigType.InscricaoQrAutoDisable, JsonNodeFactory.instance.numberNode(1));
        ensureConfig(ConfigType.InscricaoQrExpiresHours, JsonNodeFactory.instance.numberNode(6));

        ensureConfig(ConfigType.ContactTelefone, JsonNodeFactory.instance.textNode("(244) 955-383-237"));
        ensureConfig(ConfigType.ContactWhatsapp, JsonNodeFactory.instance.textNode("+244 953 712 955"));
        ensureConfig(ConfigType.ContactEmail, JsonNodeFactory.instance.textNode("contato@igrejabaluarte.com"));
        ensureConfig(ConfigType.ContactEndereco, JsonNodeFactory.instance.textNode("Rua da Igreja, 123 - Centro, Cidade/UF"));
        ensureConfig(ConfigType.ContactFacebookUrl, JsonNodeFactory.instance.textNode("https://facebook.com"));
        ensureConfig(ConfigType.ContactInstagramUrl, JsonNodeFactory.instance.textNode("https://instagram.com"));
        ensureConfig(ConfigType.ContactYoutubeUrl, JsonNodeFactory.instance.textNode("https://youtube.com"));
        ensureConfig(ConfigType.ContactTwitterUrl, JsonNodeFactory.instance.textNode("https://twitter.com"));
        ensureConfig(ConfigType.ContactHorariosCulto, defaultHorariosCulto());
    }

    private void ensureConfig(ConfigType type, JsonNode value) {
        if (configurationRepository.findByType(type).isPresent()) {
            return;
        }
        save(new ConfiguracaoDto(value, type));
    }

    private ArrayNode defaultHorariosCulto() {
        ArrayNode array = JsonNodeFactory.instance.arrayNode();
        array.add(horarioDia("Domingo", List.of("09:00 - Escola Bíblica", "19:00 - Culto de Celebração")));
        array.add(horarioDia("Quarta-feira", List.of("20:00 - Culto de Oração")));
        array.add(horarioDia("Sábado", List.of("19:00 - Ensaio do Louvor")));
        return array;
    }

    private ObjectNode horarioDia(String dia, List<String> horarios) {
        ObjectNode node = JsonNodeFactory.instance.objectNode();
        node.put("dia", dia);
        ArrayNode h = node.putArray("horarios");
        for (String item : horarios) {
            h.add(item);
        }
        return node;
    }


    public ConfiguracaoModel SelectByType(ConfigType limiteInscritos)  {
        ////System.out.println(limiteInscritos.name());
        return configurationRepository.findByType(limiteInscritos).orElseThrow(() -> new NoSuchElementException("Lamentamos mas este config não existe na base dados"));
    }

    public Map<ConfigType, Object> Estatisticas() {
        Map<ConfigType, Object> lista = new HashMap<>();
        for (ConfiguracaoModel value : configurationRepository.findAll()) {

            switch (value.getType()) {
                case MembrosLimite:
                    lista.put(value.getType(), new Value(userRepository.count() - 1, asDouble(value.getValue(), 0)));
                    break;
                case ActividadeLimite:
                    lista.put(value.getType(), new Value(actividadeRepository.count(), asDouble(value.getValue(), 0)));
                    int inscrito = 0;
                    int comentario = 0;
                    for (ActividadeModel actividadeModel : actividadeRepository.findAll()) {
                        inscrito += inscritosRepository.findByActividade(actividadeModel).size();
                        comentario += comentarioRepository.findByActividade(actividadeModel).size();
                    }
                    lista.put(ConfigType.IncritosLimiteActividade,
                            new Value(inscrito, asDouble(SelectByType(ConfigType.IncritosLimiteActividade).getValue(), 0)));
                    lista.put(ConfigType.ComentarioLimiteActividade,
                            new Value(comentario, asDouble(SelectByType(ConfigType.ComentarioLimiteActividade).getValue(), 0)));
                    break;
                case VisitasLimite:
                    lista.put(value.getType(), new Value(vistosRepository.count(), asDouble(value.getValue(), 0)));
                    break;
                case NewlesterLimite:
                    lista.put(value.getType(), new Value(newlesterRepository.count(), asDouble(value.getValue(), 0)));
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

    private enum DashboardPeriodo {
        hoje, semana, mes, ano
    }

    private DashboardPeriodo parsePeriodo(String periodo) {
        if (periodo == null || periodo.isBlank()) return DashboardPeriodo.semana;
        try {
            return DashboardPeriodo.valueOf(periodo.trim().toLowerCase(Locale.ROOT));
        } catch (Exception ignore) {
            return DashboardPeriodo.semana;
        }
    }

    private record TimeRange(LocalDateTime start, LocalDateTime end) {}

    private TimeRange rangeFor(DashboardPeriodo periodo, LocalDate today) {
        return switch (periodo) {
            case hoje -> new TimeRange(today.atStartOfDay(), today.plusDays(1).atStartOfDay());
            case semana -> new TimeRange(today.minusDays(6).atStartOfDay(), today.plusDays(1).atStartOfDay());
            case mes -> new TimeRange(today.minusDays(29).atStartOfDay(), today.plusDays(1).atStartOfDay());
            case ano -> new TimeRange(today.minusDays(364).atStartOfDay(), today.plusDays(1).atStartOfDay());
        };
    }

    public Map<String, Object> Charts() {
        return Charts(null);
    }

    public Map<String, Object> Charts(String periodoRaw) {
        LocalDate today = LocalDate.now();
        DashboardPeriodo periodo = parsePeriodo(periodoRaw);

        List<Map<String, Object>> visitas = new ArrayList<>();
        List<Map<String, Object>> crescimento = new ArrayList<>();

        DateTimeFormatter dayMonth = DateTimeFormatter.ofPattern("dd/MM");

        if (periodo == DashboardPeriodo.hoje) {
            LocalDateTime startDay = today.atStartOfDay();
            for (int h = 0; h < 24; h++) {
                LocalDateTime start = startDay.plusHours(h);
                LocalDateTime end = start.plusHours(1);
                var vistos = vistosRepository.findByDataBetween(start, end);
                long totalVisitas = vistos.size();
                long usuarios = vistos.stream()
                        .map(v -> v.getIp())
                        .filter(Objects::nonNull)
                        .distinct()
                        .count();

                String label = String.format("%02dh", h);
                visitas.add(Map.of("mes", label, "visitas", totalVisitas, "usuarios", usuarios));

                long membrosAteFim = Math.max(0, userRepository.countByDataCadastroBefore(end) - 1);
                crescimento.add(Map.of("mes", label, "membros", membrosAteFim));
            }
        } else if (periodo == DashboardPeriodo.ano) {
            for (int i = 11; i >= 0; i--) {
                YearMonth ym = YearMonth.from(today.minusMonths(i));
                LocalDateTime start = ym.atDay(1).atStartOfDay();
                LocalDateTime end = ym.plusMonths(1).atDay(1).atStartOfDay();

                var vistos = vistosRepository.findByDataBetween(start, end);
                long totalVisitas = vistos.size();
                long usuarios = vistos.stream()
                        .map(v -> v.getIp())
                        .filter(Objects::nonNull)
                        .distinct()
                        .count();

                String mes = ym.getMonth().getDisplayName(TextStyle.SHORT, new Locale("pt", "BR"));
                mes = mes.substring(0, 1).toUpperCase() + mes.substring(1);

                visitas.add(Map.of("mes", mes, "visitas", totalVisitas, "usuarios", usuarios));

                long membrosAteFimDoMes = Math.max(0, userRepository.countByDataCadastroBefore(end) - 1);
                crescimento.add(Map.of("mes", mes, "membros", membrosAteFimDoMes));
            }
        } else {
            int days = periodo == DashboardPeriodo.mes ? 30 : 7;
            for (int i = days - 1; i >= 0; i--) {
                LocalDate d = today.minusDays(i);
                LocalDateTime start = d.atStartOfDay();
                LocalDateTime end = d.plusDays(1).atStartOfDay();

                var vistos = vistosRepository.findByDataBetween(start, end);
                long totalVisitas = vistos.size();
                long usuarios = vistos.stream()
                        .map(v -> v.getIp())
                        .filter(Objects::nonNull)
                        .distinct()
                        .count();

                String label = periodo == DashboardPeriodo.semana
                        ? switch (d.getDayOfWeek()) {
                            case MONDAY -> "Seg";
                            case TUESDAY -> "Ter";
                            case WEDNESDAY -> "Qua";
                            case THURSDAY -> "Qui";
                            case FRIDAY -> "Sex";
                            case SATURDAY -> "Sáb";
                            case SUNDAY -> "Dom";
                        }
                        : dayMonth.format(d);

                visitas.add(Map.of("mes", label, "visitas", totalVisitas, "usuarios", usuarios));

                long membrosAteFim = Math.max(0, userRepository.countByDataCadastroBefore(end) - 1);
                crescimento.add(Map.of("mes", label, "membros", membrosAteFim));
            }
        }

        // ===== Distribuição de conteúdo (contagens) =====
        long totArtigos = artigosRepository.count();
        long totVideos = midiaRepository.countByType(MidiaType.VIDEO);
        long totAudios = midiaRepository.countByType(MidiaType.AUDIO);
        long totActividades = actividadeRepository.count();

        List<Map<String, Object>> conteudo = List.of(
                Map.of("nome", "Artigos", "valor", totArtigos, "cor", "#CB2020"),
                Map.of("nome", "Vídeos", "valor", totVideos, "cor", "#E64D4D"),
                Map.of("nome", "Áudios", "valor", totAudios, "cor", "#F97272"),
                Map.of("nome", "Eventos", "valor", totActividades, "cor", "#FB9A9A"));

        // ===== Engajamento (período selecionado) =====
        List<Map<String, Object>> engajamento = new ArrayList<>();
        if (periodo == DashboardPeriodo.hoje) {
            LocalDate d = today;
            LocalDateTime start = d.atStartOfDay();
            LocalDateTime end = d.plusDays(1).atStartOfDay();

            long comentarios = comentarioRepository.countByActividadeIsNotNullAndDataPublicacao(d);
            long curtidas = comentarioLikeRepository.countByDataLikeBetween(start, end);
            long compartilhamentos = userDownloadRepository.countByDataBetween(start, end);

            engajamento.add(Map.of(
                    "dia", "Hoje",
                    "comentarios", comentarios,
                    "curtidas", curtidas,
                    "compartilhamentos", compartilhamentos));
        } else if (periodo == DashboardPeriodo.ano) {
            for (int i = 11; i >= 0; i--) {
                YearMonth ym = YearMonth.from(today.minusMonths(i));
                LocalDateTime start = ym.atDay(1).atStartOfDay();
                LocalDateTime end = ym.plusMonths(1).atDay(1).atStartOfDay();

                LocalDate startDate = start.toLocalDate();
                LocalDate endDateInclusive = end.minusDays(1).toLocalDate();

                long comentarios = comentarioRepository.countByActividadeIsNotNullAndDataPublicacaoBetween(startDate, endDateInclusive);
                long curtidas = comentarioLikeRepository.countByDataLikeBetween(start, end);
                long compartilhamentos = userDownloadRepository.countByDataBetween(start, end);

                String label = ym.getMonth().getDisplayName(TextStyle.SHORT, new Locale("pt", "BR"));
                label = label.substring(0, 1).toUpperCase() + label.substring(1);

                engajamento.add(Map.of(
                        "dia", label,
                        "comentarios", comentarios,
                        "curtidas", curtidas,
                        "compartilhamentos", compartilhamentos));
            }
        } else {
            int days = periodo == DashboardPeriodo.mes ? 30 : 7;
            for (int i = days - 1; i >= 0; i--) {
                LocalDate d = today.minusDays(i);
                LocalDateTime start = d.atStartOfDay();
                LocalDateTime end = d.plusDays(1).atStartOfDay();

                long comentarios = comentarioRepository.countByActividadeIsNotNullAndDataPublicacao(d);
                long curtidas = comentarioLikeRepository.countByDataLikeBetween(start, end);
                long compartilhamentos = userDownloadRepository.countByDataBetween(start, end);

                String label = periodo == DashboardPeriodo.semana
                        ? switch (d.getDayOfWeek()) {
                            case MONDAY -> "Seg";
                            case TUESDAY -> "Ter";
                            case WEDNESDAY -> "Qua";
                            case THURSDAY -> "Qui";
                            case FRIDAY -> "Sex";
                            case SATURDAY -> "Sáb";
                            case SUNDAY -> "Dom";
                        }
                        : dayMonth.format(d);

                engajamento.add(Map.of(
                        "dia", label,
                        "comentarios", comentarios,
                        "curtidas", curtidas,
                        "compartilhamentos", compartilhamentos));
            }
        }

        return Map.of(
                "visitas", visitas,
                "conteudo", conteudo,
                "engajamento", engajamento,
                "crescimento", crescimento);
    }

    public AdminDashboardStatsDto dashboardStats() {
        return dashboardStats(null);
    }

    public AdminDashboardStatsDto dashboardStats(String periodoRaw) {
        LocalDate today = LocalDate.now();
        DashboardPeriodo periodo = parsePeriodo(periodoRaw);
        TimeRange range = rangeFor(periodo, today);

        double membrosLimite = numberValueOrDefault(ConfigType.MembrosLimite, 0);
        double actividadeLimite = numberValueOrDefault(ConfigType.ActividadeLimite, 0);
        double inscritosLimite = numberValueOrDefault(ConfigType.IncritosLimiteActividade, 0);
        double comentariosLimite = numberValueOrDefault(ConfigType.ComentarioLimiteActividade, 0);
        double visitasLimite = numberValueOrDefault(ConfigType.VisitasLimite, 0);
        double newlesterLimite = numberValueOrDefault(ConfigType.NewlesterLimite, 0);

        long membrosTotal = Math.max(0, userRepository.countByDataCadastroBetween(range.start(), range.end()) - 1);
        long actividadesTotal = actividadeRepository.countByDataPublicacaoBetween(range.start(), range.end());
        long inscritosTotal = inscritosRepository.countByDataInscricaoBetween(range.start(), range.end());
        long comentariosTotal = comentarioRepository.countByActividadeIsNotNullAndDataPublicacaoBetween(
                range.start().toLocalDate(),
                range.end().minusDays(1).toLocalDate());
        long visitasTotal = vistosRepository.countByDataBetween(range.start(), range.end());
        long newlesterTotal = newlesterRepository.count();

        return new AdminDashboardStatsDto(
                new Value(membrosTotal, membrosLimite),
                new Value(actividadesTotal, actividadeLimite),
                new Value(inscritosTotal, inscritosLimite),
                new Value(comentariosTotal, comentariosLimite),
                new Value(visitasTotal, visitasLimite),
                new Value(newlesterTotal, newlesterLimite));
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

    public double numberValueOrDefault(ConfigType type, double fallback) {
        return configValueOrDefault(type, fallback);
    }

    private double configValueOrDefault(ConfigType type, double fallback) {
        return configurationRepository.findByType(type)
                .map(ConfiguracaoModel::getValue)
                .map(value -> asDouble(value, fallback))
                .orElse(fallback);
    }

    private String stringValueOrDefault(ConfigType type, String fallback) {
        return configurationRepository.findByType(type)
                .map(ConfiguracaoModel::getValue)
                .map(value -> {
                    if (value == null || value.isNull()) return fallback;
                    if (value.isTextual()) return value.asText();
                    if (value.isNumber() || value.isBoolean()) return value.asText();
                    return fallback;
                })
                .orElse(fallback);
    }

    private JsonNode jsonValueOrNull(ConfigType type) {
        return configurationRepository.findByType(type)
                .map(ConfiguracaoModel::getValue)
                .orElse(null);
    }

    public PublicContactConfigDto publicContactConfig() {
        ensureDefaults();

        String telefone = stringValueOrDefault(ConfigType.ContactTelefone, "");
        String whatsapp = stringValueOrDefault(ConfigType.ContactWhatsapp, "");
        String email = stringValueOrDefault(ConfigType.ContactEmail, "");
        String endereco = stringValueOrDefault(ConfigType.ContactEndereco, "");
        String facebook = stringValueOrDefault(ConfigType.ContactFacebookUrl, "");
        String instagram = stringValueOrDefault(ConfigType.ContactInstagramUrl, "");
        String youtube = stringValueOrDefault(ConfigType.ContactYoutubeUrl, "");
        String twitter = stringValueOrDefault(ConfigType.ContactTwitterUrl, "");

        List<PublicContactConfigDto.HorarioCulto> horarios = new ArrayList<>();
        JsonNode horariosNode = jsonValueOrNull(ConfigType.ContactHorariosCulto);
        if (horariosNode != null && horariosNode.isArray()) {
            for (JsonNode item : horariosNode) {
                String dia = item.path("dia").asText("");
                List<String> hs = new ArrayList<>();
                JsonNode list = item.path("horarios");
                if (list.isArray()) {
                    for (JsonNode h : list) {
                        if (h != null && !h.isNull()) hs.add(h.asText());
                    }
                }
                if (!dia.isBlank() && !hs.isEmpty()) {
                    horarios.add(new PublicContactConfigDto.HorarioCulto(dia, hs));
                }
            }
        }
        if (horarios.isEmpty()) {
            horarios = List.of(
                    new PublicContactConfigDto.HorarioCulto("Domingo", List.of("09:00 - Escola Bíblica", "19:00 - Culto de Celebração")),
                    new PublicContactConfigDto.HorarioCulto("Quarta-feira", List.of("20:00 - Culto de Oração")),
                    new PublicContactConfigDto.HorarioCulto("Sábado", List.of("19:00 - Ensaio do Louvor")));
        }

        return new PublicContactConfigDto(
                telefone,
                whatsapp,
                email,
                endereco,
                new PublicContactConfigDto.Socials(facebook, instagram, youtube, twitter),
                horarios);
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
        config.setValue(JsonNodeFactory.instance.numberNode(value));
        if (config.getLancado() == null) {
            config.setLancado(LocalDateTime.now());
        }
        config.setEditado(LocalDateTime.now());
        configurationRepository.save(config);
    }

    private double asDouble(JsonNode value, double fallback) {
        if (value == null || value.isNull()) return fallback;
        if (value.isNumber()) return value.asDouble();
        if (value.isBoolean()) return value.booleanValue() ? 1 : 0;
        if (value.isTextual()) {
            try {
                return Double.parseDouble(value.asText());
            } catch (Exception ignored) {
                return fallback;
            }
        }
        return fallback;
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
