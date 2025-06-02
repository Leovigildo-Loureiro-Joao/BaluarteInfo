package com.igreja.api.services;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.user.UserDto;
import com.igreja.api.dto.user.UserDtoData;
import com.igreja.api.models.UserModel;
import com.igreja.api.repositories.UserRepository;
import com.igreja.api.utils.GravatarUtils;
import com.mchange.v2.beans.BeansUtils;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class UserService implements UserDetailsService{

    @Autowired
    private UserRepository userRepository;
    
    
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
        if (user.getRoles()==null) {
            return new String[]{"USER"};
        }else{
            return user.getRoles().split(",");
        }
    }

    public List<UserModel> findAll(){
        return userRepository.findAll();
    }


    public UserModel findById(long id){
        return userRepository.findById(id).orElseThrow(()->new NoSuchElementException("It is user not exists"));
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
            throw new NoSuchElementException("It is user exists"); 
        }
        user.setImg( GravatarUtils.getGravatarUrl(user.getEmail()));
        return userRepository.save(user);
    }
}
