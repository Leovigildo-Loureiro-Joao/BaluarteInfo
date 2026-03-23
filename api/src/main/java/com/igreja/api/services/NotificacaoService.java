package com.igreja.api.services;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import com.igreja.api.dto.mensage.MensagemDto;
import com.igreja.api.enums.ConfigType;
import com.igreja.api.enums.NotificacaoType;
import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.ArtigoModel;
import com.igreja.api.models.MidiaModel;
import com.igreja.api.models.NotificacaoModel;
import com.igreja.api.repositories.ArtigosRepository;
import com.igreja.api.repositories.ComentarioRepository;
import com.igreja.api.repositories.InscritosRepository;
import com.igreja.api.repositories.MidiaRepository;
import com.igreja.api.repositories.NotificacaoRepository;
import com.igreja.api.repositories.VistosRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
public class NotificacaoService {

    private static final int WARNING_MARGIN = 5;

    @Value("${app.notificacoes.cleanup.enabled:true}")
    private boolean cleanupEnabled;

    @Value("${app.notificacoes.cleanup.read-retention-days:30}")
    private int cleanupReadRetentionDays;

    private final NotificacaoRepository notificacaoRepository;
    private final ConfigService configService;
    private final ActividadeService actividadeService;
    private final UserService userService;
    private final MensagemService mensagemService;
    private final InscritosRepository inscritosRepository;
    private final ComentarioRepository comentarioRepository;
    private final ArtigosRepository artigosRepository;
    private final MidiaRepository midiaRepository;
    private final VistosRepository vistosRepository;

    public NotificacaoService(
            NotificacaoRepository notificacaoRepository,
            ConfigService configService,
            ActividadeService actividadeService,
            UserService userService,
            MensagemService mensagemService,
            InscritosRepository inscritosRepository,
            ComentarioRepository comentarioRepository,
            ArtigosRepository artigosRepository,
            VistosRepository vistosRepository,
            MidiaRepository midiaRepository) {
        this.notificacaoRepository = notificacaoRepository;
        this.configService = configService;
        this.actividadeService = actividadeService;
        this.userService = userService;
        this.mensagemService = mensagemService;
        this.inscritosRepository = inscritosRepository;
        this.comentarioRepository = comentarioRepository;
        this.artigosRepository = artigosRepository;
        this.midiaRepository = midiaRepository;
        this.vistosRepository = vistosRepository;
    }

    public List<NotificacaoModel> unread(int page, int size) {
        return notificacaoRepository.findByLido(false,PageRequest.of(page, size)).getContent();
    }

    public int deleteRead(int page, int size){
        int deletedCount = 0;
        for (NotificacaoModel notificacaoModel : notificacaoRepository.findByLido(true,PageRequest.of(page, size))) {
            notificacaoRepository.deleteById(notificacaoModel.getId());
            deletedCount++;
        }
        return deletedCount;
    }

    public List<NotificacaoModel> all() {
        return notificacaoRepository.findAll();
    }

    public Page<NotificacaoModel> page(boolean unread, Pageable pageable) {
        return unread ? notificacaoRepository.findByLido(false, pageable) : notificacaoRepository.findAll(pageable);
    }


    public NotificacaoModel markAsRead(int id) {
        NotificacaoModel notificacao = notificacaoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Notificação inexistente."));
        notificacao.setLido(true);
        return notificacaoRepository.save(notificacao);
    }

    public void notifyActividadeGaleria() {
        actividadeService.AllData().forEach(t -> {
            if (t.getDataEvento() == null) return;
            long comentarios = comentarioRepository.countByActividade(t);
            double limite = configService.numberValueOrDefault(ConfigType.ComentarioLimiteActividade, 50);
            if (comentarios >= limite && t.getDataEvento().isBefore(LocalDateTime.now())) {
                String assunto = actividadeLabel(t);
                String descricao = "A actividade " + assunto + " já tem " + comentarios
                        + " comentários e foi encerrada. Actualize a galeria para marcar os momentos.";
                createNotificationIfAbsent("GALERIA:ACTIVIDADE:" + t.getId(), assunto, descricao, NotificacaoType.GALERIA);
            }
        });
    }

    public void notifyActividadeLimiteInscritos() {
        double totalIncritos = configService.numberValueOrDefault(ConfigType.IncritosLimiteActividade, 100);
        actividadeService.AllData().forEach(t -> {
            if (t.getDataEvento() == null) return;
            long inscritos = inscritosRepository.countByActividade(t);
            boolean closeToLimit = inscritos >= Math.max(1, totalIncritos - WARNING_MARGIN);
            boolean futureEvent = t.getDataEvento().isAfter(LocalDateTime.now());
            if (closeToLimit && futureEvent) {
                String assunto = actividadeLabel(t);
                String descricao = "A actividade " + assunto + " já tem " + inscritos
                        + " inscritos e está próxima do limite configurado.";
                createNotificationIfAbsent("LIMITE_INSCRITOS:ACTIVIDADE:" + t.getId(), assunto, descricao, NotificacaoType.LIMITE_INSCRITOS);
            }
        });
    }

    public void notifyActividadeLembrete() {
        actividadeService.AllData().forEach(t -> {
            if (t.getDataEvento() == null) return;
            long diferenca = ChronoUnit.DAYS.between(LocalDateTime.now(), t.getDataEvento());
            String assunto = actividadeLabel(t);
            String descricao = "A actividade " + assunto + " vai acontecer em "
                    + t.getDataEvento().getDayOfMonth() + "/" + t.getDataEvento().getMonthValue() + "/"
                    + t.getDataEvento().getYear() + ".";
            if (diferenca >= 0 && diferenca <= 3) {
                createNotificationIfAbsent("LEMBRETE:ACTIVIDADE:" + t.getId(), assunto, descricao, NotificacaoType.LEMBRETE);
            }
        });
    }

    public void notifyVistos() {
        double limite = configService.numberValueOrDefault(ConfigType.VisitasLimite, 100);

        artigosRepository.findAll().forEach(artigo -> {
            long totalVistos = vistosRepository.countByArtigo(artigo);
            if (totalVistos >= limite) {
                String descricao = "O artigo " + artigo.getTitulo() + " atingiu " + totalVistos
                        + " visualizações e merece destaque na plataforma.";
                createNotificationIfAbsent("VISTOS:ARTIGO:" + artigo.getId(), artigo.getTitulo(), descricao, NotificacaoType.VISTOS);
            }
        });

        midiaRepository.findAll().forEach(midia -> {
            long totalVistos = vistosRepository.countByMidia(midia);
            if (totalVistos >= limite) {
                String descricao = "A mídia " + midia.getTitulo() + " atingiu " + totalVistos
                        + " visualizações e merece destaque na plataforma.";
                createNotificationIfAbsent("VISTOS:MIDIA:" + midia.getId(), midia.getTitulo(), descricao, NotificacaoType.VISTOS);
            }
        });
    }

    public void notifyEmailUsersVideo(List<ActividadeModel> actividades) {
        userService.findAll().forEach(use -> {
            actividades.forEach(t -> {
                if (t.getDataEvento().isBefore(LocalDateTime.now())) {
                    String descricao = "Ola " + use.nome() + " a nossa actividade " + t.getTema()
                            + " ja tem um trailer, aceda a nossa plataforma para mais detalhes";
                    mensagemService.save(new MensagemDto("Notificacao de Actividade", descricao, use.email()));
                }
            });
        });
    }

    public void notifyEmailUsersGaleria(List<ActividadeModel> actividades) {
        userService.findAll().forEach(use -> {
            actividades.forEach(t -> {
                if (t.getDataEvento().isBefore(LocalDateTime.now())) {
                    String descricao = "Ola " + use.nome() + " a nossa actividade " + t.getTema()
                            + " ja tem uma galeria actualizada, aceda a nossa plataforma para mais detalhes";
                    mensagemService.save(new MensagemDto("Notificacao de Actividade", descricao, use.email()));
                }
            });
        });
    }

    public void notifyArtigo(List<ArtigoModel> artigos) {
        userService.findAll().forEach(use -> {
            artigos.forEach(t -> {
                String descricao = "Ola " + use.nome() + " a nosso novo artigo " + t.getTitulo()
                        + " ja esta disponivel, aceda a nossa plataforma para mais detalhes";
                mensagemService.save(new MensagemDto("Notificacao de Artigo", descricao, use.email()));
            });
        });
    }

    /** Remove notificações lidas mais antigas que o período de retenção (dias). */
    public long cleanupReadNotifications(int retentionDays) {
        int safeDays = Math.max(1, retentionDays);
        LocalDateTime cutoff = LocalDateTime.now().minusDays(safeDays);
        return notificacaoRepository.deleteByLidoIsTrueAndDataNotificacaoBefore(cutoff);
    }

    /** Executa cleanup baseado em properties (sem lançar exceção). */
    public Optional<Long> cleanupConfigured() {
        if (!cleanupEnabled) {
            return Optional.empty();
        }
        try {
            return Optional.of(cleanupReadNotifications(cleanupReadRetentionDays));
        } catch (Exception ignored) {
            return Optional.empty();
        }
    }

    private void createNotificationIfAbsent(String refKey, String assunto, String descricao, NotificacaoType type) {
        if (refKey == null || refKey.isBlank()) {
            return;
        }
        if (notificacaoRepository.existsByRefKey(refKey)) {
            return;
        }
        NotificacaoModel notificacao = new NotificacaoModel();
        notificacao.setRefKey(refKey);
        notificacao.setAssunto(assunto);
        notificacao.setDescricao(descricao);
        notificacao.setDataNotificacao(LocalDateTime.now());
        notificacao.setLido(false);
        notificacao.setType(type);
        notificacaoRepository.save(notificacao);
    }

    private String actividadeLabel(ActividadeModel actividade) {
        if (actividade == null) return "";
        String titulo = actividade.getTitulo();
        if (titulo == null || titulo.isBlank()) {
            titulo = actividade.getTema();
        }
        Integer edicao = actividade.getEdicao();
        if (edicao != null && edicao > 0) {
            return titulo + " (Edição " + edicao + ")";
        }
        return titulo;
    }

}
