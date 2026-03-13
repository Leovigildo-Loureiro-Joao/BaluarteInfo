package com.igreja.api.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.admin.AdminAuditLogDto;
import com.igreja.api.enums.AdminAuditType;
import com.igreja.api.models.AdminAuditLogModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.repositories.AdminAuditLogRepository;
import com.igreja.api.repositories.UserRepository;

@Service
public class AdminAuditLogService {

    private final AdminAuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public AdminAuditLogService(AdminAuditLogRepository auditLogRepository, UserRepository userRepository) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    public AdminAuditLogDto log(String userEmail, String acao, String detalhes, String ip, AdminAuditType tipo) {
        UserModel user = userRepository.findByEmail(userEmail).orElse(null);
        AdminAuditLogModel log = new AdminAuditLogModel();
        log.setUser(user);
        log.setAcao(acao);
        log.setDetalhes(detalhes);
        log.setIp(ip);
        log.setTipo(tipo == null ? AdminAuditType.INFO : tipo);
        return toDto(auditLogRepository.save(log));
    }

    public Page<AdminAuditLogDto> pageForUser(String userEmail, int page, int size, AdminAuditType tipo) {
        UserModel user = userRepository.findByEmail(userEmail).orElse(null);
        var pageable = PageRequest.of(page, size);
        Page<AdminAuditLogModel> result = tipo == null
                ? auditLogRepository.findByUserOrderByDataDesc(user, pageable)
                : auditLogRepository.findByUserAndTipoOrderByDataDesc(user, tipo, pageable);
        return result.map(this::toDto);
    }

    private AdminAuditLogDto toDto(AdminAuditLogModel model) {
        return new AdminAuditLogDto(
                model.getId(),
                model.getAcao(),
                model.getDetalhes(),
                model.getIp(),
                model.getData(),
                model.getTipo());
    }
}
