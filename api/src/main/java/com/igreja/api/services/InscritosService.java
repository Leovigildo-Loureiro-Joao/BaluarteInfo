package com.igreja.api.services;

import java.time.DateTimeException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.NoSuchElementException;

import org.cloudinary.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.igreja.api.dto.inscrito.InscritosData;
import com.igreja.api.dto.inscrito.InscritosDto;
import com.igreja.api.dto.inscrito.InscritosPublicDto;
import com.igreja.api.dto.user.UserActividadeInscritaDto;
import com.igreja.api.enums.StatusIncritos;
import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.InscritosModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.repositories.InscritosRepository;
import com.igreja.api.utils.QRCodeGeneratorUtils;

@Service
public class InscritosService {

    @Autowired
    private InscritosRepository inscritosRepository;

    @Autowired
    private ActividadeService actividadeService;

    @Autowired
    private UserService userService;

    public  byte[] save(InscritosDto inscritos) throws Exception{
        ActividadeModel actividade=actividadeService.Select(inscritos.idActividade());
        UserModel user=userService.findById(inscritos.idUser());
        InscritosModel inscritosModel=new InscritosModel();
        inscritosModel.setUser(user);
        inscritosModel.setActividade(actividade);
        inscritosModel.setNome(user.getNome());
        inscritosModel.setEmail(user.getEmail());
        inscritosModel.setTelefone(user.getTelefone());
        if (actividade.getDataEvento().isAfter(LocalDateTime.now())) {
            inscritosModel=inscritosRepository.save(inscritosModel);
            ObjectMapper mapper= new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
             String jsonData =mapper.writeValueAsString(Map.of(
                "Id", inscritosModel.getId(),
                "userId", user.getId(),
                "eventoId", actividade.getId(),
                "dataEvento", actividade.getDataEvento()
            ));
            return QRCodeGeneratorUtils.generateQRCodeImage(jsonData, 300 , 300);
        }
        throw new DateTimeException("Lamentamos mas esta actividade ja passou");
    }

    public byte[] savePublic(int idActividade, InscritosPublicDto inscritos) throws Exception {
        ActividadeModel actividade = actividadeService.Select(idActividade);
        InscritosModel inscritosModel = new InscritosModel();
        inscritosModel.setActividade(actividade);
        inscritosModel.setNome(inscritos.nome());
        inscritosModel.setEmail(inscritos.email());
        inscritosModel.setTelefone(inscritos.telefone());

        if (actividade.getDataEvento().isAfter(LocalDateTime.now())) {
            inscritosModel = inscritosRepository.save(inscritosModel);
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            String jsonData = mapper.writeValueAsString(Map.of(
                    "Id", inscritosModel.getId(),
                    "eventoId", actividade.getId(),
                    "dataEvento", actividade.getDataEvento()
            ));
            return QRCodeGeneratorUtils.generateQRCodeImage(jsonData, 300, 300);
        }
        throw new DateTimeException("Lamentamos mas esta actividade ja passou");
    }


    public InscritosModel MarcarPresenca (JSONObject presenca){
        long id=presenca.getLong("Id");
        LocalDateTime dateTime=LocalDateTime.parse(presenca.getString("datEvento"));
        if (dateTime.isBefore(LocalDateTime.now())){
            throw new DateTimeException("Lamentamos mas esta actividade ja passou");
            
        }
        InscritosModel inscritosModel=Select(id);
        inscritosModel.setStatus(StatusIncritos.PRESENTE);
        inscritosModel.setDataCheckin(LocalDateTime.now());
        return inscritosRepository.save(inscritosModel);
    }

    public InscritosModel Select (long id){
        return inscritosRepository.findById(id).orElseThrow(()-> new NoSuchElementException("Houve um erro inexperado"));
    }

    public void Delete (long id){
        InscritosModel inscritosModel=Select(id);
        if (inscritosModel.getStatus().equals(StatusIncritos.PRESENTE)){
            throw new DateTimeException("Lamentamos mas esta actividade ja passou");
        }
        inscritosRepository.delete(inscritosModel); 
    }

    public Page<InscritosData> list(Pageable pageable, int actividadeId) {
        Page<InscritosModel> page;
        if (actividadeId != 0) {
            ActividadeModel actividade = actividadeService.Select(actividadeId);
            page = inscritosRepository.findByActividade(actividade, pageable);
        } else {
            page = inscritosRepository.findAll(pageable);
        }
        return page.map(this::toData);
    }

    public Page<InscritosData> listByUser(String email, Pageable pageable) {
        UserModel user = userService.loadUserByEmail(email);
        return inscritosRepository.findByUser(user, pageable)
                .map(this::toData);
    }

    public Page<UserActividadeInscritaDto> listActivitiesByUser(String email, Pageable pageable) {
        UserModel user = userService.loadUserByEmail(email);
        return inscritosRepository.findByUser(user, pageable)
                .map(inscrito -> {
                    ActividadeModel actividade = inscrito.getActividade();
                    return new UserActividadeInscritaDto(
                            actividade.getId(),
                            actividade.getTitulo(),
                            actividade.getTema(),
                            actividade.getEndereco(),
                            actividade.getTipoEvento(),
                            actividade.getPublicoAlvo(),
                            actividade.getDuracao(),
                            actividade.getDataEvento(),
                            actividade.getImg(),
                            inscrito.getDataInscricao(),
                            inscrito.getStatus());
                });
    }

    private InscritosData toData(InscritosModel inscrito) {
        var actividade = inscrito.getActividade();
        UserModel user = inscrito.getUser();
        String nome = user != null ? user.getNome() : inscrito.getNome();
        String email = user != null ? user.getEmail() : inscrito.getEmail();
        String telefone = user != null ? user.getTelefone() : inscrito.getTelefone();

        return new InscritosData(
                inscrito.getId(),
                actividade.getId(),
                actividade.getTitulo(),
                actividade.getTema(),
                actividade.getDataEvento(),
                nome,
                email,
                telefone,
                inscrito.getDataInscricao(),
                inscrito.getDataCheckin(),
                inscrito.getStatus());
    }
}
