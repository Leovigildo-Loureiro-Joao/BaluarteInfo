package com.igreja.api.services;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

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
            int comentarios = comentarioRepository.findByActividade(t).size();
            double limite = configService.numberValueOrDefault(ConfigType.ComentarioLimiteActividade, 50);
            if (comentarios >= limite && t.getDataEvento().isBefore(LocalDateTime.now())) {
                String descricao = "A actividade " + t.getTema() + " já tem " + comentarios
                        + " comentários e foi encerrada. Actualize a galeria para marcar os momentos.";
                createNotificationIfAbsent(t.getTema(), descricao, NotificacaoType.GALERIA);
            }
        });
    }

    public void notifyActividadeLimiteInscritos() {
        double totalIncritos = configService.numberValueOrDefault(ConfigType.IncritosLimiteActividade, 100);
        actividadeService.AllData().forEach(t -> {
            int inscritos = inscritosRepository.findByActividade(t).size();
            boolean closeToLimit = inscritos >= Math.max(1, totalIncritos - WARNING_MARGIN);
            boolean futureEvent = t.getDataEvento().isAfter(LocalDateTime.now());
            if (closeToLimit && futureEvent) {
                String descricao = "A actividade " + t.getTema() + " já tem " + inscritos
                        + " inscritos e está próxima do limite configurado.";
                createNotificationIfAbsent(t.getTema(), descricao, NotificacaoType.LIMITE_INSCRITOS);
            }
        });
    }

    public void notifyActividadeLembrete() {
        actividadeService.AllData().forEach(t -> {
            long diferenca = ChronoUnit.DAYS.between(LocalDateTime.now(), t.getDataEvento());
            String descricao = "A actividade " + t.getTema() + " vai acontecer em "
                    + t.getDataEvento().getDayOfMonth() + "/" + t.getDataEvento().getMonthValue() + "/"
                    + t.getDataEvento().getYear() + ".";
            if (diferenca >= 0 && diferenca <= 3) {
                createNotificationIfAbsent(t.getTema(), descricao, NotificacaoType.LEMBRETE);
            }
        });
    }

    public void notifyVistos() {
        double limite = configService.numberValueOrDefault(ConfigType.VisitasLimite, 100);

        artigosRepository.findAll().forEach(artigo -> {
            var vistos=vistosRepository.findByArtigo(artigo);
            int totalVistos = vistos.size();
            if (totalVistos >= limite) {
                String descricao = "O artigo " + artigo.getTitulo() + " atingiu " + totalVistos
                        + " visualizações e merece destaque na plataforma.";
                createNotificationIfAbsent(artigo.getTitulo(), descricao, NotificacaoType.VISTOS);
            }
        });

        midiaRepository.findAll().forEach(midia -> {
             var vistos=vistosRepository.findByMidia(midia);
            int totalVistos = vistos.size();
            if (totalVistos >= limite) {
                String descricao = "A mídia " + midia.getTitulo() + " atingiu " + totalVistos
                        + " visualizações e merece destaque na plataforma.";
                createNotificationIfAbsent(midia.getTitulo(), descricao, NotificacaoType.VISTOS);
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

    private void createNotificationIfAbsent(String assunto, String descricao, NotificacaoType type) {
        if (notificacaoRepository.findByDescricao(descricao).isEmpty()) {
            NotificacaoModel notificacao = new NotificacaoModel();
            notificacao.setAssunto(assunto);
            notificacao.setDescricao(descricao);
            notificacao.setDataNotificacao(LocalDateTime.now());
            notificacao.setLido(false);
            notificacao.setType(type);
            notificacaoRepository.save(notificacao);
        }
    }

}
