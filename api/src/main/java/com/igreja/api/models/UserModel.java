package com.igreja.api.models;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

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
    @Generated(value = "increment")
    private Long id;
    private String username;
    @Email
    private String email;
    private String password;
    private String roles;

    @OneToMany(cascade = CascadeType.ALL)
    private List<ComentarioModel> comentarios;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
       return null;
    }
    public UserModel(String username, String password, String roles) {
        this.username = username;
        this.password = password;
        this.roles = roles;
    }

    

}
