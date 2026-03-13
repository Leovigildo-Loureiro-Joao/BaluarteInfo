package com.igreja.api.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.igreja.api.dto.sobre.SobreDto;
import com.igreja.api.dto.sobre.SobreDto.BotaoDto;
import com.igreja.api.dto.sobre.SobreDto.ContatoDto;
import com.igreja.api.dto.sobre.SobreDto.CtaDto;
import com.igreja.api.dto.sobre.SobreDto.EnderecoDto;
import com.igreja.api.dto.sobre.SobreDto.EstatisticaDto;
import com.igreja.api.dto.sobre.SobreDto.HistoriaDto;
import com.igreja.api.dto.sobre.SobreDto.HorarioDto;
import com.igreja.api.dto.sobre.SobreDto.ImagemDto;
import com.igreja.api.dto.sobre.SobreDto.LocalizacaoDto;
import com.igreja.api.dto.sobre.SobreDto.MapaDto;
import com.igreja.api.dto.sobre.SobreDto.PastorDto;
import com.igreja.api.dto.sobre.SobreDto.ValorDto;
import com.igreja.api.models.SobreModel;
import com.igreja.api.repositories.SobreRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SobreService {

    private static final int SINGLETON_ID = 1;

    private final SobreRepository repository;
    private final ObjectMapper objectMapper;

    public SobreDto get() {
        return repository.findById(SINGLETON_ID)
                .map(this::deserialize)
                .orElseGet(this::empty);
    }

    public SobreDto save(SobreDto dto) {
        SobreDto normalized = normalize(dto);
        SobreModel model = repository.findById(SINGLETON_ID)
                .orElseGet(() -> new SobreModel(SINGLETON_ID));

        model.setConteudo(serialize(normalized));
        repository.save(model);

        return normalized;
    }

    // ----- Helpers -----

    private String serialize(SobreDto dto) {
        try {
            return objectMapper.writeValueAsString(dto);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Não foi possível serializar o conteúdo do Sobre.", exception);
        }
    }

    private SobreDto deserialize(SobreModel model) {
        try {
            SobreDto dto = objectMapper.readValue(model.getConteudo(), SobreDto.class);
            return normalize(dto);
        } catch (Exception exception) {
            // Se houver qualquer erro de JSON, devolve um payload vazio para não quebrar o admin.
            return empty();
        }
    }

    private SobreDto empty() {
        return new SobreDto(
                new HistoriaDto("", List.of(), List.of(), "", List.of()),
                List.of(),
                List.of(),
                List.of(),
                new LocalizacaoDto(
                        new EnderecoDto("", "", "", "", "", "", ""),
                        List.of(),
                        new ContatoDto("", "", ""),
                        new MapaDto(null, null, "")
                ),
                new CtaDto("", "", new BotaoDto("", ""), new BotaoDto("", ""), false)
        );
    }

    private SobreDto normalize(SobreDto dto) {
        if (dto == null) {
            return empty();
        }

        HistoriaDto historia = dto.historia() != null
                ? new HistoriaDto(
                        safe(dto.historia().titulo()),
                        safeList(dto.historia().descricao()),
                        safeList(dto.historia().imagens()),
                        safe(dto.historia().dataFundacao()),
                        safeList(dto.historia().fundadores()))
                : new HistoriaDto("", List.of(), List.of(), "", List.of());

        LocalizacaoDto localizacao = dto.localizacao() != null
                ? new LocalizacaoDto(
                        dto.localizacao().endereco() != null
                                ? dto.localizacao().endereco()
                                : new EnderecoDto("", "", "", "", "", "", ""),
                        safeList(dto.localizacao().horarios()),
                        dto.localizacao().contato() != null
                                ? dto.localizacao().contato()
                                : new ContatoDto("", "", ""),
                        dto.localizacao().mapa() != null
                                ? dto.localizacao().mapa()
                                : new MapaDto(null, null, "")
                )
                : new LocalizacaoDto(
                        new EnderecoDto("", "", "", "", "", "", ""),
                        List.of(),
                        new ContatoDto("", "", ""),
                        new MapaDto(null, null, "")
                );

        CtaDto cta = dto.cta() != null
                ? dto.cta()
                : new CtaDto("", "", new BotaoDto("", ""), new BotaoDto("", ""), false);

        return new SobreDto(
                historia,
                safeList(dto.valores()),
                safeList(dto.pastores()),
                safeList(dto.estatisticas()),
                localizacao,
                cta
        );
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private <T> List<T> safeList(List<T> value) {
        return value == null ? List.of() : value;
    }
}
