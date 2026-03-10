package com.igreja.api.services;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.igreja.api.enums.ConfigType;
import com.igreja.api.enums.NotificacaoType;
import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.ArtigoModel;
import com.igreja.api.models.ConfiguracaoModel;
import com.igreja.api.models.MidiaModel;
import com.igreja.api.models.NotificacaoModel;
import com.igreja.api.models.VistosModel;
import com.igreja.api.repositories.ArtigosRepository;
import com.igreja.api.repositories.ComentarioRepository;
import com.igreja.api.repositories.InscritosRepository;
import com.igreja.api.repositories.MidiaRepository;
import com.igreja.api.repositories.NotificacaoRepository;

@ExtendWith(MockitoExtension.class)
class NotificacaoServiceTest {

    @Mock
    private NotificacaoRepository notificacaoRepository;

    @Mock
    private ConfigService configService;

    @Mock
    private ActividadeService actividadeService;

    @Mock
    private UserService userService;

    @Mock
    private MensagemService mensagemService;

    @Mock
    private InscritosRepository inscritosRepository;

    @Mock
    private ComentarioRepository comentarioRepository;

    @Mock
    private ArtigosRepository artigosRepository;

    @Mock
    private MidiaRepository midiaRepository;

    @InjectMocks
    private NotificacaoService notificacaoService;

    @Test
    void shouldCreateLimitNotificationWhenActivityIsNearCapacity() {
        ActividadeModel actividade = createActivity("Retiro", LocalDateTime.now().plusDays(4));
        ConfiguracaoModel config = createConfig(ConfigType.IncritosLimiteActividade, 10);

        when(configService.SelectByType(ConfigType.IncritosLimiteActividade)).thenReturn(config);
        when(actividadeService.AllData()).thenReturn(List.of(actividade));
        when(inscritosRepository.findByActividade(actividade)).thenReturn(List.of(new com.igreja.api.models.InscritosModel(),
                new com.igreja.api.models.InscritosModel(),
                new com.igreja.api.models.InscritosModel(),
                new com.igreja.api.models.InscritosModel(),
                new com.igreja.api.models.InscritosModel()));
        when(notificacaoRepository.findByDescricao(any())).thenReturn(Optional.empty());

        notificacaoService.notifyActividadeLimiteInscritos();

        ArgumentCaptor<NotificacaoModel> captor = ArgumentCaptor.forClass(NotificacaoModel.class);
        verify(notificacaoRepository).save(captor.capture());
        NotificacaoModel saved = captor.getValue();

        org.junit.jupiter.api.Assertions.assertEquals(NotificacaoType.LIMITE_INSCRITOS, saved.getType());
        org.junit.jupiter.api.Assertions.assertEquals("Retiro", saved.getAssunto());
        org.junit.jupiter.api.Assertions.assertTrue(saved.getDescricao().contains("próxima do limite"));
        org.junit.jupiter.api.Assertions.assertFalse(saved.isLido());
    }

    @Test
    void shouldNotCreateLimitNotificationForPastActivity() {
        ActividadeModel actividade = createActivity("Culto", LocalDateTime.now().minusDays(1));
        ConfiguracaoModel config = createConfig(ConfigType.IncritosLimiteActividade, 10);

        when(configService.SelectByType(ConfigType.IncritosLimiteActividade)).thenReturn(config);
        when(actividadeService.AllData()).thenReturn(List.of(actividade));
        when(inscritosRepository.findByActividade(actividade)).thenReturn(List.of(new com.igreja.api.models.InscritosModel(),
                new com.igreja.api.models.InscritosModel(),
                new com.igreja.api.models.InscritosModel(),
                new com.igreja.api.models.InscritosModel(),
                new com.igreja.api.models.InscritosModel(),
                new com.igreja.api.models.InscritosModel()));

        notificacaoService.notifyActividadeLimiteInscritos();

        verify(notificacaoRepository, never()).save(any());
    }

    @Test
    void shouldCreateReminderNotificationForUpcomingActivity() {
        ActividadeModel actividade = createActivity("Conferência", LocalDateTime.now().plusDays(2));

        when(actividadeService.AllData()).thenReturn(List.of(actividade));
        when(notificacaoRepository.findByDescricao(any())).thenReturn(Optional.empty());

        notificacaoService.notifyActividadeLembrete();

        ArgumentCaptor<NotificacaoModel> captor = ArgumentCaptor.forClass(NotificacaoModel.class);
        verify(notificacaoRepository).save(captor.capture());
        NotificacaoModel saved = captor.getValue();

        org.junit.jupiter.api.Assertions.assertEquals(NotificacaoType.LEMBRETE, saved.getType());
        org.junit.jupiter.api.Assertions.assertEquals("Conferência", saved.getAssunto());
        org.junit.jupiter.api.Assertions.assertTrue(saved.getDescricao().contains("vai acontecer em"));
    }

    @Test
    void shouldNotCreateReminderNotificationWhenOneAlreadyExists() {
        ActividadeModel actividade = createActivity("Conferência", LocalDateTime.now().plusDays(1));

        when(actividadeService.AllData()).thenReturn(List.of(actividade));
        when(notificacaoRepository.findByDescricao(any())).thenReturn(Optional.of(new NotificacaoModel()));

        notificacaoService.notifyActividadeLembrete();

        verify(notificacaoRepository, never()).save(any());
    }

    @Test
    void shouldCreateGalleryNotificationForFinishedActivityWithEnoughComments() {
        ActividadeModel actividade = createActivity("Vigília", LocalDateTime.now().minusDays(2));
        ConfiguracaoModel config = createConfig(ConfigType.ComentarioLimiteActividade, 3);

        when(configService.SelectByType(ConfigType.ComentarioLimiteActividade)).thenReturn(config);
        when(actividadeService.AllData()).thenReturn(List.of(actividade));
        when(comentarioRepository.findByActividade(actividade)).thenReturn(List.of(
                new com.igreja.api.models.ComentarioModel(),
                new com.igreja.api.models.ComentarioModel(),
                new com.igreja.api.models.ComentarioModel()));
        when(notificacaoRepository.findByDescricao(any())).thenReturn(Optional.empty());

        notificacaoService.notifyActividadeGaleria();

        ArgumentCaptor<NotificacaoModel> captor = ArgumentCaptor.forClass(NotificacaoModel.class);
        verify(notificacaoRepository).save(captor.capture());
        NotificacaoModel saved = captor.getValue();

        org.junit.jupiter.api.Assertions.assertEquals(NotificacaoType.GALERIA, saved.getType());
        org.junit.jupiter.api.Assertions.assertEquals("Vigília", saved.getAssunto());
    }

    @Test
    void shouldCreateViewsNotificationForPopularArticle() {
        ConfiguracaoModel config = createConfig(ConfigType.VisitasLimite, 3);
        ArtigoModel artigo = new ArtigoModel();
        artigo.setTitulo("Estudo de Romanos");
        artigo.setVistos(List.of(new VistosModel(), new VistosModel(), new VistosModel()));

        when(configService.SelectByType(ConfigType.VisitasLimite)).thenReturn(config);
        when(artigosRepository.findAll()).thenReturn(List.of(artigo));
        when(midiaRepository.findAll()).thenReturn(List.of());
        when(notificacaoRepository.findByDescricao(any())).thenReturn(Optional.empty());

        notificacaoService.notifyVistos();

        ArgumentCaptor<NotificacaoModel> captor = ArgumentCaptor.forClass(NotificacaoModel.class);
        verify(notificacaoRepository).save(captor.capture());
        NotificacaoModel saved = captor.getValue();

        org.junit.jupiter.api.Assertions.assertEquals(NotificacaoType.VISTOS, saved.getType());
        org.junit.jupiter.api.Assertions.assertEquals("Estudo de Romanos", saved.getAssunto());
        org.junit.jupiter.api.Assertions.assertTrue(saved.getDescricao().contains("visualizações"));
    }

    @Test
    void shouldNotCreateViewsNotificationWhenThresholdIsNotReached() {
        ConfiguracaoModel config = createConfig(ConfigType.VisitasLimite, 5);
        MidiaModel midia = new MidiaModel();
        midia.setTitulo("Trailer do congresso");
        midia.setVistos(List.of(new VistosModel(), new VistosModel()));

        when(configService.SelectByType(ConfigType.VisitasLimite)).thenReturn(config);
        when(artigosRepository.findAll()).thenReturn(List.of());
        when(midiaRepository.findAll()).thenReturn(List.of(midia));

        notificacaoService.notifyVistos();

        verify(notificacaoRepository, never()).save(any());
    }

    private ActividadeModel createActivity(String tema, LocalDateTime dataEvento) {
        ActividadeModel actividade = new ActividadeModel();
        actividade.setTema(tema);
        actividade.setTitulo(tema);
        actividade.setDataEvento(dataEvento);
        return actividade;
    }

    private ConfiguracaoModel createConfig(ConfigType type, double value) {
        ConfiguracaoModel config = new ConfiguracaoModel();
        config.setType(type);
        config.setValue(value);
        return config;
    }
}
