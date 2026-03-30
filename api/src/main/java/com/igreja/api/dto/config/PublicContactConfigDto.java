package com.igreja.api.dto.config;

import java.util.List;

public record PublicContactConfigDto(
        String telefone,
        String whatsapp,
        String email,
        String endereco,
        Socials socials,
        List<HorarioCulto> horariosCulto) {

    public record Socials(
            String facebook,
            String instagram,
            String youtube,
            String twitter) {
    }

    public record HorarioCulto(String dia, List<String> horarios) {
    }
}

