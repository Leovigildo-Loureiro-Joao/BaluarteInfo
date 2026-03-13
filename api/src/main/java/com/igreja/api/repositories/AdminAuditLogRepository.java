package com.igreja.api.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.enums.AdminAuditType;
import com.igreja.api.models.AdminAuditLogModel;
import com.igreja.api.models.UserModel;

public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLogModel, Long> {
    Page<AdminAuditLogModel> findByUserOrderByDataDesc(UserModel user, Pageable pageable);
    Page<AdminAuditLogModel> findByUserAndTipoOrderByDataDesc(UserModel user, AdminAuditType tipo, Pageable pageable);
}
