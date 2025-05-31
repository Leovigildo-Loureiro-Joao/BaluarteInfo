package com.igreja.api.services;

import java.time.DateTimeException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.NoSuchElementException;

import org.cloudinary.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.igreja.api.dto.InscritosDto;
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


    public InscritosModel MarcarPresenca (JSONObject presenca){
        long id=presenca.getLong("idInscrito");
        LocalDateTime dateTime=LocalDateTime.parse(presenca.getString("datEvento"));
        if (dateTime.isBefore(LocalDateTime.now())){
            throw new DateTimeException("Lamentamos mas esta actividade ja passou");
            
        }
        InscritosModel inscritosModel=Select(id);
        inscritosModel.setStatus(StatusIncritos.PRESENTE);
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
}