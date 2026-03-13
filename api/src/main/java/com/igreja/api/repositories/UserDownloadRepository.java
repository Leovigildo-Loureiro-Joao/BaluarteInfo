package com.igreja.api.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.igreja.api.enums.MidiaType;
import com.igreja.api.enums.UserContentType;
import com.igreja.api.models.UserDownloadModel;
import com.igreja.api.models.UserModel;

public interface UserDownloadRepository extends JpaRepository<UserDownloadModel, Long> {
    Page<UserDownloadModel> findByUserAndTipoOrderByDataDesc(UserModel user, UserContentType tipo, Pageable pageable);

    @Query("""
        SELECT d FROM UserDownloadModel d
        JOIN d.midia m
        WHERE d.user = :user
          AND d.tipo = :tipo
          AND (:midiaType IS NULL OR m.type = :midiaType)
        ORDER BY d.data DESC
    """)
    Page<UserDownloadModel> findMidiaDownloads(
            @Param("user") UserModel user,
            @Param("tipo") UserContentType tipo,
            @Param("midiaType") MidiaType midiaType,
            Pageable pageable);
}
