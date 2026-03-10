package com.igreja.api.services;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.igreja.api.dto.InfoDto;
import com.igreja.api.enums.InfoType;
import com.igreja.api.models.InfoIgrejaModel;
import com.igreja.api.repositories.InfoIgrejaRepository;

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
            return persist(new InfoIgrejaModel(), dto, false);
        }
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma informação cadastrada para este tipo.");
    }

    public InfoIgrejaModel update(InfoDto dto) throws IOException{
        if (Existis(dto.type())) {
            return persist(findByType(dto.type()), dto, true);
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ainda não existe informação cadastrada para este tipo.");
    }

    private InfoIgrejaModel persist(InfoIgrejaModel model, InfoDto dto, boolean keepCurrentImage) throws IOException {
        BeanUtils.copyProperties(dto, model);
        model.setImg(resolveImage(dto.img(), model.getImg(), keepCurrentImage));
        return igrejaRepository.save(model);
    }

    private String resolveImage(MultipartFile file, String currentImage, boolean keepCurrentImage) throws IOException {
        if (file == null || file.isEmpty()) {
            return keepCurrentImage ? currentImage : null;
        }

        upload.generateUniqueName(file.getOriginalFilename());
        try {
            return upload.uploadFileAsync(file, "image");
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IOException("O upload da imagem foi interrompido.", exception);
        } catch (Exception exception) {
            throw new IOException("Não foi possível fazer upload da imagem.", exception);
        }
    }

    public boolean Existis (InfoType type){
        return igrejaRepository.findByType(type).isPresent();
    }

    public InfoIgrejaModel findByType (InfoType type){
        return igrejaRepository.findByType(type)
                .orElseThrow(() -> new NoSuchElementException("Informação não encontrada para o tipo " + type.name()));
    }

     public List<InfoIgrejaModel> AllData() {
        return igrejaRepository.findAll();
    }
   

}
