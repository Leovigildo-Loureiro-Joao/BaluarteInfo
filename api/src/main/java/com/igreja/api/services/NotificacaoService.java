package com.igreja.api.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.MensagemDto;
import com.igreja.api.enums.ConfigType;
import com.igreja.api.enums.NotificacaoType;
import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.ArtigosModel;
import com.igreja.api.models.NotificacaoModel;
import com.igreja.api.repositories.NotificacaoRepository;

@Service
public class NotificacaoService {

    @Autowired
    private NotificacaoRepository notificacaoRepository;

    @Autowired
    private ConfigService configService;

    @Autowired
    private ActividadeService service;

    @Autowired
    private ArtigoService artigoService;

    @Autowired
    private UserService userService;

    @Autowired
    private MensagemService mensagemService;


    public List<NotificacaoModel> All(){
        return notificacaoRepository.findByLido(true);
    }

    public void NotifyActividadeGaleria(){
        //Quando a muitos comentarios
        //Quando a actividade ja encerrou para marcar momentos
        service.AllData().forEach(t -> {
            int comentarios = t.getComentarios().size();
            if (comentarios >= configService.SelectByType(ConfigType.ComentarioLimite).getValue() && t.getDataEvento().isAfter(LocalDateTime.now())) {
                String descricao = "A actividade " + t.getTema() + " ja tem " + comentarios + " comentarios e ja foi encerrada actualize a galeria de modo a marcar momentos"; 
                if (notificacaoRepository.findByDescricao(descricao).isEmpty()) {
                    NotificacaoModel notificacao = new NotificacaoModel();
                    notificacao.setAssunto(t.getTema());
                    notificacao.setDescricao(descricao);
                    notificacao.setDataNotificacao(LocalDateTime.now());
                    notificacao.setLido(false);
                    notificacao.setType(NotificacaoType.GALERIA);
                    notificacaoRepository.save(notificacao);
                }
            }
        });
    }

    public void NotifyActividadeLimiteInscritos(){
         //Quando aos incritos previstos excederam para lancar um trailler ou uma mensagem para todos
        //Quando a actividade ja encerrou para marcar momentos
        int totalIncritos = configService.SelectByType(ConfigType.IncritosLimite).getValue();
         service.AllData().forEach(t -> {
            int inscritos = t.getInscritos().size();
            if (inscritos >= totalIncritos-5 && t.getDataEvento().isAfter(LocalDateTime.now()) && t.getDataEvento().isBefore(LocalDateTime.now())) {
                String descricao = "A actividade " + t.getTema() + " ja tem " + inscritos + " incritos";
                if (notificacaoRepository.findByDescricao(descricao).isEmpty()) {
                    NotificacaoModel notificacao = new NotificacaoModel();
                    notificacao.setAssunto(t.getTema());
                    notificacao.setDescricao(descricao);
                    notificacao.setDataNotificacao(LocalDateTime.now());
                    notificacao.setLido(false);
                    notificacao.setType(NotificacaoType.LIMITE_INSCRITOS);
                    notificacaoRepository.save(notificacao);
                }
            }
         });
    }

    public void NotifyActividadeLembrete(){
        //Quando uma actividade ta proxima a acontecer
        service.AllData().forEach(t -> {
            int diferenca = t.getDataEvento().getDayOfYear() - LocalDateTime.now().getDayOfYear();
            String descricao = "A actividade " + t.getTema() + " vai acontecer em " + t.getDataEvento().getDayOfMonth() + "/" + t.getDataEvento().getMonthValue() + "/" + t.getDataEvento().getYear();
            if (diferenca <= 3 && diferenca >= 0 && notificacaoRepository.findByDescricao(descricao).isEmpty()) {
                NotificacaoModel notificacao = new NotificacaoModel();
                notificacao.setAssunto(t.getTema());
                notificacao.setDescricao(descricao);
                notificacao.setDataNotificacao(LocalDateTime.now());
                notificacao.setLido(false);
                notificacao.setType(NotificacaoType.LEMBRETE);
                notificacaoRepository.save(notificacao);
            }
        });
    }

    public void NotifyVistos(){
        //Quando muitos viram ou acederam muito um artigo ou um video
        
    }

    public void NotifyEmailUsersVideo(List<ActividadeModel> actividades){
        //Quando muitos viram ou acederam muito um artigo ou um video
        userService.findAll().forEach(use -> {
            actividades.forEach(t -> {
                if (t.getDataEvento().isBefore(LocalDateTime.now())) {
                    String descricao = "Ola " + use.getUsername() + " a nossa actividade " + t.getTema() + " ja tem um trailer, aceda a nossa plataforma para mais detalhes";
                    mensagemService.save(new MensagemDto(use.getEmail(), "Notificacao de Actividade", descricao,userService.findById(1).getEmail()));
                }
                
            });
        });
    }

    public void NotifyEmailUsersGaleria(List<ActividadeModel> actividades){
        //Quando muitos viram ou acederam muito um artigo ou um video
        userService.findAll().forEach(use -> {
            actividades.forEach(t -> {
                if (t.getDataEvento().isBefore(LocalDateTime.now())) {
                    String descricao = "Ola " + use.getUsername() + " a nossa actividade " + t.getTema() + " ja tem uma galeria actualizada, aceda a nossa plataforma para mais detalhes";
                    mensagemService.save(new MensagemDto(use.getEmail(), "Notificacao de Actividade", descricao,userService.findById(1).getEmail()));
                }
                
            });
        });
    }

    public void NotifyArtigo(List<ArtigosModel> artigos){
        //Quando muitos viram ou acederam muito um artigo ou um video
        userService.findAll().forEach(use -> {
            artigos.forEach(t -> {
                String descricao = "Ola " + use.getUsername() + " a nosso novo artigo " + t.getTitulo() + " ja esta disponivel, aceda a nossa plataforma para mais detalhes";
                mensagemService.save(new MensagemDto(use.getEmail(), "Notificacao de Artigo", descricao,userService.findById(1).getEmail()));
            });
        });
    }

}
