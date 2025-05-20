package com.igreja.api.models;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.igreja.api.enums.MidiaType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter@Setter
@NoArgsConstructor
@Table(name = "midia")
public class MidiaModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    private MidiaType type;

    @NotBlank
    private String descricao;

    private String titulo;

    @NotBlank
    private String tempo;

    @NotBlank(message = "URL é obrigatória")  // Não pode ser vazio
    @Pattern(
        regexp = "^(https?|ftp)://[^\\s/$.?#].[^\\s]*$",  // Regex para URLs
        message = "URL inválida! Ex: http://exemplo.com"
    )
    private String url;

    private LocalDate dataPublicacao;

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "midia")
    private List<ComentarioModel> comentarios=new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "midia")
    private List<VistosModel> vistos=new ArrayList<>();

    @ManyToOne
    @JoinColumn(referencedColumnName = "id")
    private ActividadeModel actividade;
    
}
