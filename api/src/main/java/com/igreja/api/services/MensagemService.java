package com.igreja.api.services;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.MensagemDto;
import com.igreja.api.dto.midia.MidiaDto;
import com.igreja.api.enums.MensagemType;
import com.igreja.api.models.MensagensModel;
import com.igreja.api.models.MidiaModel;
import com.igreja.api.repositories.MensagemRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class MensagemService {

    @Autowired
    private MensagemRepository mensagemRepository;

    public MensagemService(JavaMailSender mensagemUtils) {
        super();
        this.mailSender=mensagemUtils;
    }

     private JavaMailSender mailSender;

    public void EnviarMensagem(MensagemDto mensagemDto){
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper;
        try {
            helper = new MimeMessageHelper(message, true);
            helper.setFrom(mensagemDto.email());
            helper.setTo(mensagemDto.destino());
            helper.setSubject(mensagemDto.assunto());
            helper.setText(mensagemDto.descricao(), true);
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public MensagensModel save(MensagemDto mensagemDto) { 
        MensagensModel mensagensModel= new MensagensModel();
        mensagensModel.setDataPublicacao(LocalDate.now());
        mensagensModel.setTipo(MensagemType.SEND);
        BeanUtils.copyProperties(mensagemDto, mensagensModel);
        EnviarMensagem(mensagemDto);
        return mensagemRepository.save(mensagensModel);
    }

    public MensagensModel responder(int id,MensagemDto mensagemDto) { 
        MensagensModel mensagensModel= save(mensagemDto);
        mensagensModel.setTipo(MensagemType.RECEIVED);
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

    public List<MensagensModel> AllData() {
      return mensagemRepository.findByTipo(MensagemType.SEND);
    }
}
