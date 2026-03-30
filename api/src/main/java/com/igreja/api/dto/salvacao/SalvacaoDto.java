package com.igreja.api.dto.salvacao;

import com.igreja.api.enums.ArtigoType;
import com.igreja.api.enums.AudioType;
import com.igreja.api.enums.VideoType;

public record SalvacaoDto(
        String imagemCapaUrl,
        String titulo,
        String conteudoMarkdown,
        String conteudoHtml,
        String videoUrl,
        String oracao,
        SalvacaoBotaoDto botao,
        SalvacaoFeedDto feed) {

    public record SalvacaoBotaoDto(String texto, String link) {
    }

    public record SalvacaoFeedDto(
            ArtigoType artigoTipo,
            AudioType audioTipo,
            VideoType videoTipo,
            Integer limit) {
    }
}

