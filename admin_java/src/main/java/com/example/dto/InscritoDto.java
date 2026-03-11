/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.dto;

import java.time.LocalDateTime;
import com.example.enums.StatusIncritos;

/**
 *
 * @author devpro
 */
public record InscritoDto(long idUser,String titulo,String tema,LocalDateTime dataMarcada,StatusIncritos status) {
    
}
