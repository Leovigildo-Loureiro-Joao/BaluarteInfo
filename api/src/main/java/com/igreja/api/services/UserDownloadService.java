package com.igreja.api.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.user.UserDownloadDto;
import com.igreja.api.enums.MidiaType;
import com.igreja.api.enums.UserContentType;
import com.igreja.api.models.ArtigoModel;
import com.igreja.api.models.MidiaModel;
import com.igreja.api.models.UserDownloadModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.repositories.ArtigosRepository;
import com.igreja.api.repositories.MidiaRepository;
import com.igreja.api.repositories.UserDownloadRepository;
import com.igreja.api.repositories.UserRepository;

import java.util.NoSuchElementException;

@Service
public class UserDownloadService {

    private final UserDownloadRepository userDownloadRepository;
    private final UserRepository userRepository;
    private final ArtigosRepository artigosRepository;
    private final MidiaRepository midiaRepository;

    public UserDownloadService(UserDownloadRepository userDownloadRepository,
            UserRepository userRepository,
            ArtigosRepository artigosRepository,
            MidiaRepository midiaRepository) {
        this.userDownloadRepository = userDownloadRepository;
        this.userRepository = userRepository;
        this.artigosRepository = artigosRepository;
        this.midiaRepository = midiaRepository;
    }

    public UserDownloadDto registerArtigoDownload(String email, int artigoId) {
        UserModel user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Este user mão existe verifique se o email esta correto"));
        ArtigoModel artigo = artigosRepository.findById(artigoId)
                .orElseThrow(() -> new NoSuchElementException("Artigo não encontrado"));
        UserDownloadModel download = new UserDownloadModel();
        download.setUser(user);
        download.setArtigo(artigo);
        download.setTipo(UserContentType.ARTIGO);
        return toDto(userDownloadRepository.save(download));
    }

    public UserDownloadDto registerMidiaDownload(String email, int midiaId) {
        UserModel user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Este user mão existe verifique se o email esta correto"));
        MidiaModel midia = midiaRepository.findById(midiaId)
                .orElseThrow(() -> new NoSuchElementException("Mídia não encontrada"));
        UserDownloadModel download = new UserDownloadModel();
        download.setUser(user);
        download.setMidia(midia);
        download.setTipo(UserContentType.MIDIA);
        return toDto(userDownloadRepository.save(download));
    }

    public Page<UserDownloadDto> listArtigoDownloads(String email, int page, int size) {
        UserModel user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Este user mão existe verifique se o email esta correto"));
        Pageable pageable = PageRequest.of(page, size);
        return userDownloadRepository.findByUserAndTipoOrderByDataDesc(user, UserContentType.ARTIGO, pageable)
                .map(this::toDto);
    }

    public Page<UserDownloadDto> listMidiaDownloads(String email, int page, int size, MidiaType midiaType) {
        UserModel user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Este user mão existe verifique se o email esta correto"));
        Pageable pageable = PageRequest.of(page, size);
        return userDownloadRepository.findMidiaDownloads(user, UserContentType.MIDIA, midiaType, pageable)
                .map(this::toDto);
    }

    private UserDownloadDto toDto(UserDownloadModel model) {
        ArtigoModel artigo = model.getArtigo();
        MidiaModel midia = model.getMidia();
        return new UserDownloadDto(
                model.getId(),
                model.getTipo(),
                model.getData(),
                artigo == null ? null : artigo.getId(),
                artigo == null ? null : artigo.getTitulo(),
                artigo == null ? null : artigo.getImg(),
                artigo == null ? null : artigo.getPdf(),
                midia == null ? null : midia.getId(),
                midia == null ? null : midia.getTitulo(),
                midia == null ? null : midia.getImagem(),
                midia == null ? null : midia.getType(),
                midia == null ? null : midia.getAudioType(),
                midia == null ? null : midia.getVideoType(),
                midia == null ? null : midia.getUrl());
    }
}
