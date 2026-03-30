package com.igreja.api.services;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.igreja.api.dto.salvacao.SalvacaoDto;
import com.igreja.api.dto.salvacao.SalvacaoDto.SalvacaoBotaoDto;
import com.igreja.api.dto.salvacao.SalvacaoDto.SalvacaoFeedDto;
import com.igreja.api.models.SalvacaoModel;
import com.igreja.api.repositories.SalvacaoRepository;
import com.igreja.api.utils.MarkdownLite;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SalvacaoService {

    private static final int SINGLETON_ID = 1;

    private final SalvacaoRepository repository;
    private final ObjectMapper objectMapper;

    public SalvacaoDto get() {
        return repository.findById(SINGLETON_ID)
                .map(this::deserialize)
                .orElseGet(this::empty);
    }

    public SalvacaoDto save(SalvacaoDto dto) {
        SalvacaoDto normalized = normalize(dto);
        SalvacaoModel model = repository.findById(SINGLETON_ID)
                .orElseGet(() -> new SalvacaoModel(SINGLETON_ID));

        model.setConteudo(serialize(normalized));
        repository.save(model);

        return normalized;
    }

    private String serialize(SalvacaoDto dto) {
        try {
            return objectMapper.writeValueAsString(dto);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Não foi possível serializar o conteúdo da Salvação.", exception);
        }
    }

    private SalvacaoDto deserialize(SalvacaoModel model) {
        try {
            SalvacaoDto dto = objectMapper.readValue(model.getConteudo(), SalvacaoDto.class);
            return normalize(dto);
        } catch (Exception exception) {
            return empty();
        }
    }

    private SalvacaoDto empty() {
        return new SalvacaoDto(
                "",
                "",
                "",
                "",
                "",
                "",
                new SalvacaoBotaoDto("", ""),
                new SalvacaoFeedDto(null, null, null, 6));
    }

    private SalvacaoDto normalize(SalvacaoDto dto) {
        if (dto == null) {
            return empty();
        }

        String markdown = safe(dto.conteudoMarkdown());
        String html = MarkdownLite.toSafeHtml(markdown);

        SalvacaoBotaoDto botao = dto.botao() != null
                ? new SalvacaoBotaoDto(safe(dto.botao().texto()), safe(dto.botao().link()))
                : new SalvacaoBotaoDto("", "");

        SalvacaoFeedDto feed = dto.feed() != null
                ? new SalvacaoFeedDto(dto.feed().artigoTipo(), dto.feed().audioTipo(), dto.feed().videoTipo(),
                        normalizeLimit(dto.feed().limit()))
                : new SalvacaoFeedDto(null, null, null, 6);

        return new SalvacaoDto(
                safe(dto.imagemCapaUrl()),
                safe(dto.titulo()),
                markdown,
                html,
                safe(dto.videoUrl()),
                safe(dto.oracao()),
                botao,
                feed);
    }

    private Integer normalizeLimit(Integer value) {
        if (value == null) {
            return 6;
        }
        if (value < 0) {
            return 0;
        }
        return Math.min(value, 30);
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}

