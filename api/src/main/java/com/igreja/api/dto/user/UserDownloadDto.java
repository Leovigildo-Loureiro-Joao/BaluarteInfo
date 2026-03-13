package com.igreja.api.dto.user;

import java.time.LocalDateTime;

import com.igreja.api.enums.AudioType;
import com.igreja.api.enums.MidiaType;
import com.igreja.api.enums.UserContentType;
import com.igreja.api.enums.VideoType;

public record UserDownloadDto(
        long id,
        UserContentType tipo,
        LocalDateTime data,
        Integer artigoId,
        String artigoTitulo,
        String artigoImagem,
        String artigoPdf,
        Integer midiaId,
        String midiaTitulo,
        String midiaImagem,
        MidiaType midiaType,
        AudioType audioType,
        VideoType videoType,
        String midiaUrl) {
}
