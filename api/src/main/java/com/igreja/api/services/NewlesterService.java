package com.igreja.api.services;

import java.util.NoSuchElementException;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.NewlesterDto;
import com.igreja.api.models.NewlesterModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.repositories.NewlesterRepository;
import com.igreja.api.utils.GravatarUtils;

@Service
public class NewlesterService {

    @Autowired
    private NewlesterRepository newlesterRepository;

     public NewlesterModel save(NewlesterDto user){
        
        if (ExistsLester(user)) {
            throw new NoSuchElementException("It is user exists"); 
        }
        NewlesterModel newlester=new NewlesterModel();
        BeanUtils.copyProperties(user, newlester);
        return newlesterRepository.save(newlester);
    }

     private boolean ExistsLester(NewlesterDto user) {
        return newlesterRepository.findByEmail(user.email()).isPresent();
     }
}
