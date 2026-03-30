package com.igreja.api.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.igreja.api.models.UserModel;
import java.time.LocalDateTime;
import com.igreja.api.enums.UserStatus;

public interface UserRepository extends JpaRepository<UserModel, Long> {

    Optional<UserModel> findByEmail(String email);

    long countByDataCadastroBefore(LocalDateTime data);

    long countByDataCadastroBetween(LocalDateTime start, LocalDateTime end);

    long countByStatus(UserStatus status);
    
    
}
