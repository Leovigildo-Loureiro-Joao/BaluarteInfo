package com.igreja.api.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.TimeoutException;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.mensage.MensagemData;
import com.igreja.api.dto.mensage.MensagemDto;
import com.igreja.api.dto.mensage.MensagemPublicDto;
import com.igreja.api.enums.MensagemType;
import com.igreja.api.enums.StatusMensage;
import com.igreja.api.models.MensagensModel;
import com.igreja.api.repositories.MensagemRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.Getter;
import lombok.Setter;

@Service
public class MensagemService {

    @Autowired
    private MensagemRepository mensagemRepository;

    @Value("${spring.mail.username}") // use spring.mail.username, não email.user!
    private String user;

    public MensagemService(JavaMailSender mensagemUtils) {
        super();
        this.mailSender=mensagemUtils;
    }

     private JavaMailSender mailSender;

    public void EnviarMensagem(MensagemDto mensagemDto){
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper;
        ////System.out.println("De: " + user);
        ////System.out.println("Para: " + mensagemDto.destino());
        ////System.out.println("Assunto: " + mensagemDto.assunto());
        ////System.out.println("Descrição: " + mensagemDto.descricao());
        try {
            helper = new MimeMessageHelper(message, true);
            helper.setFrom(user);
            helper.setTo(mensagemDto.destino());
            helper.setSubject(mensagemDto.assunto());
            helper.setText(mensagemDto.descricao(), mensagemDto.descricao());
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public MensagensModel save(MensagemDto mensagemDto) { 
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean sendFromSystem = mensagemDto.destino() != null && !mensagemDto.destino().isBlank();
        MensagensModel mensagensModel= new MensagensModel();
        mensagensModel.setDataPublicacao(LocalDateTime.now());
        mensagensModel.setEmail(sendFromSystem ? user : authentication.getName());
        mensagensModel.setTipo(sendFromSystem ? MensagemType.SEND : MensagemType.RECEIVED);
        BeanUtils.copyProperties(mensagemDto, mensagensModel);
        mensagensModel.setDestino(sendFromSystem ? mensagemDto.destino() : user);
        try {
            EnviarMensagem(new MensagemDto(mensagemDto.descricao(), mensagemDto.assunto(),mensagensModel.getDestino()));    
            mensagensModel.setStatus(StatusMensage.ENVIADO);
        } catch (Exception e) {
            ////System.out.println(e.getMessage());
        }
        return mensagemRepository.save(mensagensModel);
    }

    public MensagensModel savePublic(MensagemPublicDto mensagemDto) {
        MensagensModel mensagensModel = new MensagensModel();
        mensagensModel.setDataPublicacao(LocalDateTime.now());
        mensagensModel.setNome(mensagemDto.nome());
        mensagensModel.setEmail(mensagemDto.email());
        mensagensModel.setTelefone(mensagemDto.telefone());
        mensagensModel.setDescricao(mensagemDto.descricao());
        mensagensModel.setAssunto(mensagemDto.assunto());
        mensagensModel.setTipo(MensagemType.RECEIVED);
        mensagensModel.setDestino(user);
        try {
            EnviarMensagem(new MensagemDto(mensagemDto.descricao(), mensagemDto.assunto(), mensagensModel.getDestino()));
            mensagensModel.setStatus(StatusMensage.ENVIADO);
        } catch (Exception e) {
            ////System.out.println(e.getMessage());
        }
        return mensagemRepository.save(mensagensModel);
    }

    public MensagensModel responder(int id,MensagemData mensagemDto) { 
        MensagensModel mensagem=Select(id);
        MensagensModel mensagensModel= save(new MensagemDto(mensagemDto.descricao(), mensagemDto.assunto(), mensagem.getEmail()));
        ignorar(id);
        return mensagemRepository.save(mensagensModel);
    }


    public MensagensModel Select(int id)  {
        return mensagemRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Lamentamos mas esta mensagem não existe na base dados"));
     }

    public MensagensModel ignorar(int id){
        MensagensModel mensagem=Select(id);
        mensagem.setLido(true);
        return mensagemRepository.save(mensagem);
    }

    public MensagensModel marcarLido(int id, boolean lido) {
        MensagensModel mensagem = Select(id);
        mensagem.setLido(lido);
        return mensagemRepository.save(mensagem);
    }

    public void delete(int id) {
        MensagensModel mensagem = Select(id);
        mensagemRepository.delete(mensagem);
    }

    public List<MensagensModel> AllData() {
      return mensagemRepository.findByTipo(MensagemType.SEND,PageRequest.of(0,10)).getContent();
    }

    public Page<MensagensModel> page(Pageable pageable) {
        return mensagemRepository.findAll(pageable);
    }

    public Page<MensagensModel> pageByTipo(MensagemType tipo, Pageable pageable) {
        return mensagemRepository.findByTipo(tipo, pageable);
    }

    public Page<MensagensModel> pageByLido(boolean lido, Pageable pageable) {
        return mensagemRepository.findByLido(lido, pageable);
    }

    public Page<MensagensModel> pageByTipoAndLido(MensagemType tipo, boolean lido, Pageable pageable) {
        return mensagemRepository.findByTipoAndLido(tipo, lido, pageable);
    }

    public Page<MensagensModel> pageForUser(String email, MensagemType tipo, Boolean lido, Pageable pageable) {
        return mensagemRepository.findByUserEmail(email, tipo, lido, pageable);
    }

    public void EnviarAsPendentes() throws TimeoutException {
        try {
            mensagemRepository.findByStatus(StatusMensage.PENDENTE,PageRequest.of(0, 10)).getContent().forEach(t -> {
                EnviarMensagem(new MensagemDto(t.getDescricao(), t.getAssunto(), t.getDestino()));
                t.setStatus(StatusMensage.ENVIADO);
                mensagemRepository.save(t);
            });
        } catch (Exception e) {
            throw new TimeoutException("A rede caiu");
        }
       
    }
}
