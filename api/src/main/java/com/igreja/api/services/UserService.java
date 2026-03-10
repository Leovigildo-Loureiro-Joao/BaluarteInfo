package com.igreja.api.services;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.user.UserDtoData;
import com.igreja.api.models.UserModel;
import com.igreja.api.repositories.UserRepository;
import com.igreja.api.utils.GravatarUtils;

@Service
public class UserService implements UserDetailsService{

    private static final String DEFAULT_ROLE = "USER";

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserModel user=userRepository.findByEmail(username).orElseThrow(()->new UsernameNotFoundException("User not found"));
        return User.builder()
        .username(user.getUsername())
        .password(user.getPassword())
        .roles(Roles(user))
        .build();
    }

    public UserModel loadUserByEmail(String username) {
        UserModel user=userRepository.findByEmail(username).orElseThrow(()->new UsernameNotFoundException("User not found"));
        return user;
    }

    public String[] Roles(UserModel user){
        String roles = normalizeRoles(user.getRoles());
        return roles.split(",");
    }

    public List<UserDtoData> findAll(){
        List<UserDtoData> userDtoDatas=new ArrayList<>();
        for (UserModel user : userRepository.findAll()) {
            userDtoDatas.add(new UserDtoData(user.getId(), user.getNome(), user.getEmail(), user.getImg(), user.getRoles()));
        }
        return userDtoDatas;
    }


    public UserModel findById(long id){
        return userRepository.findById(id).orElseThrow(()->new NoSuchElementException("It is user not exists"));
    }

       public UserDtoData findByIdData(long id){
        UserModel user=findById(id);
        return new UserDtoData(user.getId(), user.getNome(), user.getUsername(), user.getImg(), user.getRoles());
    }


    public UserDtoData findByIdData(String username){
        UserModel user=loadUserByEmail(username);
        return new UserDtoData(user.getId(), user.getNome(), user.getUsername(), user.getImg(), user.getRoles());
    }


    public boolean ExistsUser(UserModel user){
        return userRepository.findByEmail(user.getUsername()).isPresent();
    }

    public UserModel save(UserModel user){
        if (ExistsUser(user)) {
            throw new NoSuchElementException("Já existe um utilizador com este email.");
        }
        user.setRoles(normalizeRoles(user.getRoles()));
        user.setImg( GravatarUtils.getGravatarUrl(user.getEmail()));
        return userRepository.save(user);
    }

    private String normalizeRoles(String roles) {
        if (roles == null || roles.isBlank()) {
            return DEFAULT_ROLE;
        }

        return java.util.Arrays.stream(roles.split(","))
                .map(String::trim)
                .filter(role -> !role.isBlank())
                .map(role -> role.startsWith("ROLE_") ? role.substring(5) : role)
                .map(String::toUpperCase)
                .distinct()
                .reduce((left, right) -> left + "," + right)
                .orElse(DEFAULT_ROLE);
    }
}
