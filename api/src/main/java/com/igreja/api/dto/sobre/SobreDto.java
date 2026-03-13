package com.igreja.api.dto.sobre;

import java.util.List;

// DTO único da página "Sobre". Mantém toda a estrutura em um único payload.
public record SobreDto(
        HistoriaDto historia,
        List<ValorDto> valores,
        List<PastorDto> pastores,
        List<EstatisticaDto> estatisticas,
        LocalizacaoDto localizacao,
        CtaDto cta
) {

    public record HistoriaDto(
            String titulo,
            List<String> descricao,
            List<ImagemDto> imagens,
            String dataFundacao,
            List<String> fundadores
    ) {}

    public record ImagemDto(
            String url,
            String descricao
    ) {}

    public record ValorDto(
            String id,
            String icon,
            String titulo,
            String descricao,
            Integer ordem,
            Boolean ativo
    ) {}

    public record PastorDto(
            String id,
            String nome,
            String cargo,
            String foto,
            String descricao,
            String email,
            Integer ordem,
            Boolean ativo
    ) {}

    public record EstatisticaDto(
            String id,
            String numero,
            String label,
            String icon,
            Integer ordem,
            Boolean ativo
    ) {}

    public record LocalizacaoDto(
            EnderecoDto endereco,
            List<HorarioDto> horarios,
            ContatoDto contato,
            MapaDto mapa
    ) {}

    public record EnderecoDto(
            String rua,
            String numero,
            String complemento,
            String bairro,
            String cidade,
            String estado,
            String cep
    ) {}

    public record HorarioDto(
            String dia,
            List<String> horarios
    ) {}

    public record ContatoDto(
            String telefone,
            String email,
            String whatsapp
    ) {}

    public record MapaDto(
            Double latitude,
            Double longitude,
            String embed
    ) {}

    public record CtaDto(
            String titulo,
            String descricao,
            BotaoDto botao1,
            BotaoDto botao2,
            Boolean ativo
    ) {}

    public record BotaoDto(
            String texto,
            String link
    ) {}
}
