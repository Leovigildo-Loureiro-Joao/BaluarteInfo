package com.igreja.api.models;

import java.time.LocalDateTime;

import com.igreja.api.enums.AdminAuditType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "admin_audit_log")
public class AdminAuditLogModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserModel user;

    private String acao;

    private String detalhes;

    private String ip;

    @Enumerated(EnumType.STRING)
    private AdminAuditType tipo = AdminAuditType.INFO;

    private LocalDateTime data = LocalDateTime.now();
}
