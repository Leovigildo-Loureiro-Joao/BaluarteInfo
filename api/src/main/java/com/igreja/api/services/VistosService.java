package com.igreja.api.services;

import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.igreja.api.models.ArtigoModel;
import com.igreja.api.models.MidiaModel;
import com.igreja.api.repositories.ArtigosRepository;
import com.igreja.api.repositories.MidiaRepository;
import com.igreja.api.repositories.VistosRepository;

@Service
public class VistosService {

    private final VistosRepository vistosRepository;
    private final ArtigosRepository artigosRepository;
    private final MidiaRepository midiaRepository;

    public VistosService(
            VistosRepository vistosRepository,
            ArtigosRepository artigosRepository,
            MidiaRepository midiaRepository) {
        this.vistosRepository = vistosRepository;
        this.artigosRepository = artigosRepository;
        this.midiaRepository = midiaRepository;
    }

    public Map<String, Long> countArticleViews(int articleId) {
        ArtigoModel artigo = artigosRepository.findById(articleId)
                .orElseThrow(() -> new NoSuchElementException("Artigo não encontrado."));
        long total = vistosRepository.findByArtigo(artigo).size();
        return Map.of("total", total);
    }

    public Map<String, Long> countMediaViews(int mediaId) {
        MidiaModel midia = midiaRepository.findById(mediaId)
                .orElseThrow(() -> new NoSuchElementException("Mídia não encontrada."));
        long total = vistosRepository.findByMidia(midia).size();
        return Map.of("total", total);
    }
}
