/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.igreja.api.dto.inscrito;


import com.igreja.api.enums.StatusIncritos;
import java.time.LocalDateTime;

public record InscritosData(long idUser,String titulo,String tema,LocalDateTime dataMarcada,StatusIncritos status) {
    
}
