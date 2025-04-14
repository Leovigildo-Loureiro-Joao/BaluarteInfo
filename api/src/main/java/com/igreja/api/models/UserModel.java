package com.igreja.api.models;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.igreja.api.utils.GravatarUtils;

import jakarta.annotation.Generated;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter@Setter
@NoArgsConstructor
@Table(name = "user")
public class UserModel implements UserDetails{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private String nome;
    @Email
    private String email;
    @NotNull
    private String password;
    private String img;
    private String roles;

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "user")
    private List<ComentarioModel> comentarios;

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "user")
    private List<InscritosModel> inscritos;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
       return null;
    }
    public UserModel(String nome, String password,String email, String roles) {
        this.nome = nome;
        this.password = password;
        this.roles = roles;
        this.email = email;
        this.img = GravatarUtils.getGravatarUrl(email);

    }
    @Override
    public String getUsername() {
        return this.email;
    }

    

}
