package com.igreja.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.igreja.api.models.FileModel;
import java.util.List;
import com.igreja.api.enums.FileStatus;


public interface FileRepository extends JpaRepository<FileModel, Long> {
    List<FileModel> findByFileStatus(FileStatus fileStatus);
}
