package com.igreja.api.services;

import java.io.IOException;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.user.InfoDto;
import com.igreja.api.enums.InfoType;
import com.igreja.api.models.InfoIgrejaModel;
import com.igreja.api.repositories.InfoIgrejaRepository;
import com.mchange.v2.beans.BeansUtils;

@Service
public class InfoIgrejaService extends uploadFiles{

    @Autowired
    private InfoIgrejaRepository igrejaRepository;

    public InfoIgrejaModel save(InfoDto dto) throws IOException{
        if (!Existis(dto.type())) {
            InfoIgrejaModel model=new InfoIgrejaModel();
            return save(model, dto);
        }
        throw new BadRequestException("Não pode haver duplicações de informações!");
    }

    public InfoIgrejaModel update(InfoDto dto) throws IOException{
        if (Existis(dto.type())) {
            InfoIgrejaModel model=findByType(dto.type());
            return save(model, dto);
        }
        throw new BadRequestException("Não existe esta informação na base de dados!");
    }

    public InfoIgrejaModel save(InfoIgrejaModel model,InfoDto dto)  throws IOException{
        BeanUtils.copyProperties(dto, model);
        if (dto.type().equals(InfoType.QuemSomos)||dto.type().equals(InfoType.Salvacao)) {
            fileSelect=dto.img();
            Upload();
            model.setImg(unique);
        }
       return igrejaRepository.save(model);    
    }

    public boolean Existis (InfoType type){
        return igrejaRepository.findByType(type).isPresent();
    }

    public InfoIgrejaModel findByType (InfoType type){
        return igrejaRepository.findByType(type).orElse(null);
    }

}
