package com.igreja.api.models;

import com.igreja.api.enums.FileStatus;
import com.igreja.api.enums.FileType;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "file")
public class FileModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @NotNull
    private FileType fileType;
    private String fileUrl;
    private String fileDescription;
    private FileStatus fileStatus=FileStatus.PENDENTE;
   
}
