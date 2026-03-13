package com.igreja.api.dto.admin;

import java.time.LocalDateTime;

import com.igreja.api.enums.AdminAuditType;

public record AdminAuditLogDto(
        long id,
        String acao,
        String detalhes,
        String ip,
        LocalDateTime data,
        AdminAuditType tipo) {
}
