package com.igreja.api.models;

import java.time.LocalDateTime;

import com.igreja.api.enums.UserContentType;

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
@Table(name = "user_download")
public class UserDownloadModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserModel user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artigo_id")
    private ArtigoModel artigo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "midia_id")
    private MidiaModel midia;

    @Enumerated(EnumType.STRING)
    private UserContentType tipo;

    private LocalDateTime data = LocalDateTime.now();
}
