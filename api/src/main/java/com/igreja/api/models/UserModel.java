package com.igreja.api.models;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Arrays;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.igreja.api.utils.GravatarUtils;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter@Setter
@NoArgsConstructor
@Table(name = "users")
public class UserModel implements UserDetails{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private String nome;
    @Email
    @NotNull
    @Column(unique = true)
    private String email;
    @NotNull
    @JsonIgnore
    private String password;
    private String img;
    private String roles;

   @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ComentarioModel> comentarios = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "user", fetch = FetchType.LAZY)
    private List<InscritosModel> inscritos=new ArrayList<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String rolesValue = roles == null || roles.isBlank() ? "USER" : roles;
        return Arrays.stream(rolesValue.split(","))
                .map(String::trim)
                .filter(role -> !role.isBlank())
                .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                .map(SimpleGrantedAuthority::new)
                .toList();
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
    @Override
    public boolean isAccountNonExpired() {
       return true;
    }
    @Override
    public boolean isAccountNonLocked() {
       return true;
    }
    @Override
    public boolean isCredentialsNonExpired() {
     return true;
    }
    @Override
    public boolean isEnabled() {
       return true;
    }

    

}
