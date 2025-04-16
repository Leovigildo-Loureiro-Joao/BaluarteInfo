package com.igreja.api.services;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.igreja.api.dto.InfoDto;
import com.igreja.api.enums.InfoType;
import com.igreja.api.models.ArtigosModel;
import com.igreja.api.models.InfoIgrejaModel;
import com.igreja.api.repositories.InfoIgrejaRepository;
import com.mchange.v2.beans.BeansUtils;

import lombok.Getter;

@Service
@Getter
public class InfoIgrejaService{

    @Autowired
    private InfoIgrejaRepository igrejaRepository;

    @Autowired
    private CloudDinaryService upload;


    public InfoIgrejaModel save(InfoDto dto) throws IOException{
        if (!Existis(dto.type())) {
            InfoIgrejaModel model=new InfoIgrejaModel();
            
        }
     throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não pode haver duplicações de informações!");
    }

    public InfoIgrejaModel update(InfoDto dto) throws IOException{
        if (Existis(dto.type())) {
            InfoIgrejaModel model=findByType(dto.type());
       
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não pode haver duplicações de informações!");
    }

    public InfoIgrejaModel save(InfoIgrejaModel model,InfoDto dto)  throws IOException{
        BeanUtils.copyProperties(dto, model);
        if (dto.type().equals(InfoType.QuemSomos)||dto.type().equals(InfoType.Salvacao)) {
            //upload.uploadFile(dto.img(), "image");
            model.setImg(upload.getUrl());
        }
       return igrejaRepository.save(model);    
    }

    public boolean Existis (InfoType type){
        return igrejaRepository.findByType(type).isPresent();
    }

    public InfoIgrejaModel findByType (InfoType type){
        return igrejaRepository.findByType(type).orElse(null);
    }

     public List<InfoIgrejaModel> AllData() throws IOException {
      return igrejaRepository.findAll();
   }

}
